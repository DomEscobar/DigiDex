import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
declare const Moralis: any;
Moralis.initialize(environment.moralisKey);
Moralis.serverURL = environment.serverURL;

@Injectable({
    providedIn: 'root'
})
export class MoralisService {

    public isLogged$ = new Subject<boolean>();

    constructor() {
        this.isLogged$.next(Moralis.User?.current() != undefined)
    }

    public async getEvents(): Promise<any> {
        const ratings = await Moralis.Cloud.run("events", {});
        return ratings;
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

    public async getList<T>(keyObj: any, top = 50): Promise<T[]> {
        const query = new Moralis.Query(keyObj.constructor.name);
        query.limit(top);
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

    public async getItem<T>(keyObj: any, key: string, equalsValue: string): Promise<T> {
        const query = new Moralis.Query(keyObj.constructor.name);
        query.equalTo(key, equalsValue);
        const queryResult = (await query.first()) as any;

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


export class User {
    className?: string;
    id?: string;
    attribute?: UserAttribute;
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

export class DigiNft {
    public power?: string;
    public specialType?: string;

    constructor(
        public owner: string | undefined,
        public name: string | undefined,
        public price: string | undefined,
        public tid: string | undefined,
        public img: string | undefined,
        public isPhysical: boolean | undefined
    ) { }

    static createEmpty(): DigiNft {
        return new DigiNft(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            false
        );
    }
}

export class DigiCollectors {

    public cards?: DigiNft[]

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
