import { EnumPermissions } from "../../../config/permissions";
import { TokenTypes } from "../App/Globals";
import ApiTokens from "../../../models/ApiTokens";
import Permissions from "../../../models/Permissions";
import { isValid } from "../ValidatesController";
import { TOAST_ERRO_CAMPOS_OBRIGATORIOS } from "../../../constants/toastMessages";
import { BaseController } from '../Routing/Domain/BaseController';
import { request, response } from "../Routing/Domain/ExpressController";
async function check(
    callback: any,
    validate: TokenTypes | Array<TokenTypes> = TokenTypes.SPA
): Promise<void> {
    if (request().cookies?.user || request().headers.authorization) {
        // Verifica se há um token de autenticação válido no banco de dados
        let connection = await ApiTokens().findOne({
            token: request().cookies.user,
            type: validate
        });
        
        if (connection) {
            if (connection.expires >= Date.now()) {
                // Atualiza a data de expiração do token
                let date = new Date(Date.now());
                date.setDate(date.getDate() + 1);
                connection.expires = date.getTime();
                connection.save();
                // Chama o callback
                callback(request().cookies.user);
            } else {
                // Remove o cookie de usuário se o token expirou
                response().cookie("user", null, { maxAge: 0 });
                response().send({ status: 401, message: "Token expired" });
            }
        } else {
            // Remove o cookie de usuário se o token é inválido
            response().cookie("user", null, { maxAge: 0 });
            response().send({ status: 401, message: "Invalid Token" });
        }
    } else {
        response().send({ status: 401, message: "Unauthorized" });
    }
}

// Verifica as permissões do usuário
async function permissionsCheck(
    callback: any,
    permissions: EnumPermissions | Array<EnumPermissions>,
    tokenType: TokenTypes | Array<TokenTypes> = TokenTypes.SPA
): Promise<void> {
    check(async () => {
        let connection = await ApiTokens().findOne({
            token: request().cookies.user,
            type: tokenType
        });

        let permission = await Permissions().findOne({
            user: connection?.user
        });

        let perm: Array<EnumPermissions> = [];
        let result = true;

        if (permission) {
            perm = permission.key;

            if (permission.group) {
                perm.concat((await Permissions().findOne({ _id: permission.group }))?.key || []);
            }

            if (Array.isArray(permissions)) {
                // Verifica se o usuário possui todas as permissões especificadas
                permissions.forEach(element => {
                    if (!perm.includes(element)) result = false;
                });
            } else {
                // Verifica se o usuário possui a permissão especificada
                result = perm.includes(permissions);
            }
        }

        if (result || perm.includes(EnumPermissions.FULL_ACCESS)) {
            // Chama o callback se o usuário possui as permissões necessárias
            callback();
        } else {
            response().send({
                status: 403, message: "Forbidden", toast: {
                    title: "Usuario sem permissao",
                    message: "O usuario precisa ter permissoes(" + JSON.stringify(permissions) + ") para poder acessar esse modulo!"
                }
            });
        }
    }, tokenType);
}

async function permissionsAndValidate(
    callback: any,
    permissions: EnumPermissions | Array<EnumPermissions>,
    validations: Array<any>,
    validateToken: TokenTypes | Array<TokenTypes> = TokenTypes.SPA
): Promise<void>{
    permissionsCheck(()=>{
        let v = isValid(request().body, validations)
        let v1 = isValid(request().params, validations)
        let v2 = isValid(request().query, validations)
        if(v.valid || v1.valid || v2.valid){
            callback();
        }else{
            response().send({
                status:500,
                message:`Há campos não preenchidos ( ${v.message.join(", ")} )`,
                toast: TOAST_ERRO_CAMPOS_OBRIGATORIOS
            })
        }
    },permissions,validateToken)
}
export const ConnectionChecker = {
    check,
    permissionsAndValidate,
    permissions: permissionsCheck,
}