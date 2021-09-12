import {injectable, inject} from "tsyringe";
import IApiHelper from "../Helpers/IApiHelper";
import Footer from "../models/FooterModel";
import Menu from "../models/Menu";

@injectable()
export default class PageLayoutService {
  constructor(@inject("IApiHelper") private apiHelper: IApiHelper) {}
  
  async getMainMenuItems() : Promise<Menu[]> {
    try {
        const menus = await this.apiHelper.getMainMenuItems();
        return menus;
    }
    catch(e) {
        throw new Error(`Failed to get Menu. Error: ${e.message}`);
        }
    }
  async getFooter() : Promise<Footer> {
    try {
        const footer = await this.apiHelper.getFooter();
        return footer;
    }
    catch(e) {
        throw new Error(`Failed to get Footer. Error: ${e.message}`);
        }
    }
}