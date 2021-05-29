import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { CardType } from '../+models/card.type';
declare const Moralis: any;
Moralis.initialize(environment.moralisKey);
Moralis.serverURL = environment.serverURL;

@Injectable({
    providedIn: 'root'
})
export class MoralisService {

    public isLogged$ = new BehaviorSubject<boolean>(false);

    constructor() {
        this.isLogged$.next(Moralis.User?.current() != undefined)

        Moralis.Web3.onAccountsChanged(async ([account]: any) => {
            const confirmed = confirm("Link this address to your account?");
            if (confirmed) {
                await Moralis.Web3.link(account);
            }
        });
    }

    public async getEvents(): Promise<any> {
        const ratings = await Moralis.Cloud.run("events", {});
        return ratings;
    }

    //todo ss only
    public async checkMissed(strength: number): Promise<boolean> {
        const succ = await Moralis.Cloud.run("checkMissed", { strength: strength });
        return succ;
    }

    //todo ss only
    public async calcHp(hp: number, strength: number, attackerType: string, defenderType: string): Promise<string> {
        const restHp = await Moralis.Cloud.run("calcHp", { hp, strength, attackerType, defenderType });
        return restHp;
    }

    public async randomName(): Promise<string> {
        const name = await Moralis.Cloud.run("randomName", {});
        return name;
    }

    public async getDigible(id: string): Promise<DigiNft> {
        const digible = await Moralis.Cloud.run("digible", { tid: id });
        return digible;
    }

    public async getDigibles(): Promise<DigiNft[]> {
        const ratings = await Moralis.Cloud.run("digibles", {});
        return ratings;
    }

    public async getCollectors(): Promise<DigiCollectors[]> {
        const ratings = await Moralis.Cloud.run("collectors", {});
        return ratings;
    }

    public async getCollector(id: string): Promise<DigiCollectors> {
        const collector = await Moralis.Cloud.run("collector", { tid: id });
        return collector;
    }

    public async loginWithMetaMask(): Promise<void> {
        try {
            let user = await Moralis.User.current();
            if (!user) {
                await Moralis.Web3.authenticate();
            }

            this.isLogged$.next(true);
        } catch (error) {
            throw Error(error);
        }
    }

    public async loginWithEmail(email: string, password: string): Promise<void> {
        try {

            await Moralis.User.logIn(email, password);
        } catch (error) {
            const user = new Moralis.User();
            user.set("username", email);
            user.set("password", password);

            await user.signUp();
        }
    }

    public async getEthTransactions(): Promise<string[]> {
        const user = Moralis.User.current();
        const transQuery = new Moralis.Query("EthTransactions");
        transQuery.equalTo("from_address", user.get("ethAddress"));

        return await transQuery.find();
    }

    public async add(objToSave: any): Promise<void> {
        const saveExtendObj = Moralis.Object.extend(objToSave.constructor.name);

        const event = new saveExtendObj();

        Object.keys(objToSave).forEach(key => {
            event.set(key, objToSave[key]);
        })

        const acl = new Moralis.ACL(Moralis.User.current());
        acl.setPublicReadAccess(true);
        event.setACL(acl);

        await event.save();
    }

    public async getList<T>(keyObj: MoralisObject, top = 50, key?: string, equalsValue?: string): Promise<T[]> {
        const query = new Moralis.Query(keyObj.getClassname());
        query.limit(top);
        if (key && equalsValue) {
            query.equalTo(key, equalsValue);
        }
        const queryResult = (await query.find()) as any[];

        const resultList = [] as any;
        queryResult.forEach((o: any) => {
            const newValue = {} as any;
            Object.keys(keyObj).forEach(key => {
                newValue[key] = o.get(key);
            })
            resultList.push(newValue);
        })

        return resultList;
    }


    public mapTo<T>(keyObj: any, o: any): T {
        const newValue = {} as any;

        Object.keys(keyObj).forEach(key => {
            newValue[key] = o.get(key);
        })

        return newValue;
    }

    public async getItem<T>(keyObj: MoralisObject, key: string, equalsValue: string, asDataObj?: boolean): Promise<T | undefined> {
        const query = new Moralis.Query(keyObj.getClassname());
        query.equalTo(key, equalsValue);
        const queryResult = (await query.first()) as any;

        if (queryResult == undefined) {
            return undefined;
        }

        if (asDataObj) {
            return queryResult;
        }

        const newValue = {} as any;
        Object.keys(keyObj).forEach(key => {
            newValue[key] = queryResult.get(key);
        })

        return newValue;
    }

    public getUser(): User {
        const currentUser = Moralis.User.current();
        return currentUser;
    }

    public getCurrentEthAddress(): string {
        const currentUser = Moralis.User.current();
        return currentUser.get("ethAddress");
    }

    public async setUserAttribute(name: string, value: string): Promise<void> {
        const user = Moralis.User.current();
        user.set(name, value);
        await user.save();
    }
}

interface MoralisObject {
    getClassname(): string;
}

export class User implements MoralisObject {
    className?: string;
    id?: string;
    attribute?: UserAttribute;

    getClassname(): string {
        return "User";
    }
}

export class UserAttribute {
    public ACL: any;
    public accounts?: string[];
    authData: any;
    createdAt?: Date;
    ethAddress?: string;
    sessionToken?: string;
    updatedAt?: Date;
    username?: string;
    email?: string;
}

export class DigiNft implements MoralisObject {

    getClassname(): string {
        return "DigiNft";
    }

    constructor(
        public owner: string | undefined,
        public name: string | undefined,
        public price: string | undefined,
        public tid: string | undefined,
        public img: string | undefined,
        public isPhysical: boolean | undefined,
        public specialType: string | undefined,
        public power: string | undefined

    ) { }

    static createEmpty(): DigiNft {
        return new DigiNft(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            false,
            undefined,
            undefined
        );
    }
}

export class DigiCollectors implements MoralisObject {

    public cards?: DigiNft[];

    getClassname(): string {
        return "DigiCollectors";
    }

    constructor(
        public tid: string | undefined,
        public name: string | undefined,
        public img: string | undefined
    ) { }

    static createEmpty(): DigiCollectors {
        return new DigiCollectors(
            undefined,
            undefined,
            undefined
        );
    }
}


export class WorldUser implements MoralisObject {
    id?: string;

    getClassname(): string {
        return "WorldUser";
    }

    constructor(
        public x: string | undefined,
        public y: string | undefined,
        public name: string | undefined,
        public tid: string | undefined
    ) { }

    static createEmpty(): WorldUser {
        return new WorldUser(
            undefined,
            undefined,
            undefined,
            undefined
        );
    }
}

export class BattleAttack implements MoralisObject {

    constructor(
        public name?: string,
        public strength?: string,
        public tid?: string
    ) {

    }

    getClassname(): string {
        return "BattleAttack";
    }

    static createEmpty(): BattleAttack {
        return new BattleAttack(
            undefined,
            undefined,
            undefined
        );
    }
}
export class BattleStats implements MoralisObject {
    constructor(
        public hp?: string,
        public type?: string,
        public tid?: string
    ) {

    }

    getClassname(): string {
        return "BattleStats";
    }

    static createEmpty(): BattleStats {
        return new BattleStats(
            undefined,
            undefined
        );
    }
}