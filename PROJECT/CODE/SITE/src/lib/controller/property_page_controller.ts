// -- IMPORTS

import type { KitReply, KitRequest } from "../kit_http";
import { propertyService } from "../service/property_service";
import { PageController } from "./page_controller";

// -- TYPES

export class PropertyPageController extends PageController {
  // -- OPERATIONS

  async processRequest(
    request: KitRequest,
    reply: KitReply,
  ): Promise<{ property: unknown }> {
    return {
      property: await propertyService.getPropertyById(request.params.id),
    };
  }
}

