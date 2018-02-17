
import { Pipe } from './pipe';
import { Metrics, FontMetrics } from './fontmetrics';

import * as Rx from 'rxjs';
import { AnnotationInfo } from './annotation_addon';

// I wanted this to be hidden... we should have a translation library
import * as messages from "../generated/variable_pb.js";

/** 
 * base class for graphics devices. work in progress. 
 */
export class GraphicsDevice {

  static LineJoin = {
    GE_ROUND_JOIN: 1,
    GE_MITRE_JOIN: 2,
    GE_BEVEL_JOIN: 3
  };
  
  static LineCap = {
    GE_ROUND_CAP: 1,
    GE_BUTT_CAP: 2,
    GE_SQUARE_CAP: 3
  };

  static font_metrics_ = new FontMetrics(); 

  height_:number;
  width_:number;

  private static new_graphic_:Rx.Subject<AnnotationInfo> = new Rx.Subject<AnnotationInfo>();

  public static get new_graphic() { return this.new_graphic_; }

  InsertGraphic(height:number, element:HTMLElement){
    GraphicsDevice.new_graphic_.next({ height, element });
  }

  static PointsToPixels(point_size:number){
    return Math.round(point_size / 96 * 128 * 1000)/1000;
  }

  static FontFamily(context):string {

    if( context.fontface === 5 ) return "symbol";

    switch(context.fontfamily){
    case "mono":
    case "monospace":
      return "Consolas";

    case "serif":
      return "Palatino Linotype";

    case "sans":
    case "sans-serif":
    case "":
      return "Calibri";

    default:
      return context.fontfamily;
    }
  }

  GraphicsResponse(x?:number[], y?:number[]){

    let response = new messages.CallResponse();
    let consoleMessage = new messages.Console();
    let graphics = new messages.GraphicsCommand();

    if(x) graphics.setXList(x);
    if(y) graphics.setYList(y);

    consoleMessage.setGraphics(graphics);
    response.setConsole(consoleMessage);
    return response;

  }

  // stub
  GraphicsCommand(message, command){}

}
