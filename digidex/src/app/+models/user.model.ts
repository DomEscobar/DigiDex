import { Guid } from "guid-typescript";
declare const Moralis: any;

export class UserModel {

    constructor(
        public id?: string,
        public ethAddress?: string,
        public name?: string,
        public img?: string,
    ) {
    }

    public async saveObject(): Promise<void> {
        try {
            const UserModel = Moralis.Object.extend("User");
            const userEntity = new UserModel();

            await userEntity.save({
                id: Guid.create(),
                ethAddress: this.ethAddress,
                name: this.name,
                img: this.img
            });
        } catch (error) {
            console.log(error);
        }
    }
}