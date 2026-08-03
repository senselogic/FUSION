// -- IMPORTS

import type { KitReply, KitRequest } from "../kit_http";
import { propertyService } from "../service/property_service";
import { PageController } from "./page_controller";

// -- TYPES

export class HomePageController extends PageController {
  // -- OPERATIONS

  async processRequest(request: KitRequest, reply: KitReply): Promise<{ favoritePropertyArray: unknown }> {
    return {
      favoritePropertyArray: await propertyService.getFavoritePropertyArray(),
    };
  }
}

