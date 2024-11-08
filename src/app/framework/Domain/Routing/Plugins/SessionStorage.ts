import { AsyncLocalStorage } from 'async_hooks'
const Session = new AsyncLocalStorage()
export function getStorage<T>(key: string): T {
    let rst: T | undefined = undefined
    try {
        const store: any = Session.getStore()
        if (store)
            rst = Session.run(store, () => store.get(key));
    } catch (err) { }
    return rst!
}
export function setStorage<T>(key: string, value: T): T {
    let rst: T | undefined = undefined
    try {
        const store: any = Session.getStore()
        if (store)
            rst = Session.run(store, () => store.set(key, value));
    } catch (err) { }
    return rst!
}
export function SessionStorage(cb: ()=>Promise<void>){
    Session.run(new Map(), cb)
}