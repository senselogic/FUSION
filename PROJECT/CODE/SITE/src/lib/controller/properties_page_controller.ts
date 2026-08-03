// -- IMPORTS

import type { KitReply, KitRequest } from "../kit_http";
import { propertyService } from "../service/property_service";
import { PageController } from "./page_controller";

// -- TYPES

export class PropertiesPageController extends PageController {
  // -- OPERATIONS

  async processRequest(request: KitRequest, reply: KitReply): Promise<{ propertyArray: unknown }> {
    return {
      propertyArray: await propertyService.getPropertyArray(),
    };
  }
}

