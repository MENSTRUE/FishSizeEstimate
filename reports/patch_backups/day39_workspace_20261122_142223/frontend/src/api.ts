export type Overview = {project:string;subtitle:string;status:string;source:string;stats:{recordings:number|null;trained_images:number|null;optimizer_steps:number|null;stereo_pairs_in_recent_investigation:number|null};verified_metric_length:boolean;length_mae_cm:number|null;length_rmse_cm:number|null;coverage_count:number;readiness:Record<string,boolean>;limitations:string[]};
export type Training = {report:Record<string,unknown>|null;loss_points:{step:number;loss:number}[];status:string};
export type Recording = {bag:string;dataset:string;status:string;trained_images:number;decode_failures:number};
export type GalleryItem = {id:number;name:string;category:string;url:string};
export type Analysis={status:string;width:number;height:number;roi:{bbox:number[];endpoints:number[][];area_ratio:number;method:string}|null;length_cm:null;note:string};
async function checked<T>(res:Response):Promise<T>{if(!res.ok){const msg=await res.text();throw new Error(msg||`HTTP ${res.status}`)}return res.json() as Promise<T>}
export const api={
 overview:()=>fetch('/api/v1/overview').then(checked<Overview>),
 training:()=>fetch('/api/v1/training').then(checked<Training>),
 recordings:()=>fetch('/api/v1/recordings').then(checked<{total:number;rows:Recording[]}>),
 gallery:()=>fetch('/api/v1/gallery?limit=60').then(checked<{total:number;items:GalleryItem[]}>),
 analyze:(file:File)=>{const f=new FormData();f.append('image',file);return fetch('/api/v1/analyze',{method:'POST',body:f}).then(checked<Analysis>)},
};

export type Point = {x:number;y:number};
export type FishObject = {id:number;class:string;confidence:number;bbox_xyxy:number[];polygon_xy:number[][]};
export type SegmentResult = {model:string;method:string;frame:{width:number;height:number};fish_count:number;objects:FishObject[];limitations:string};
export type MeasurementInput = {image_width:number;image_height:number;snout:Point;tail_tip:Point;reference_start:Point;reference_end:Point;reference_length_cm:number;coplanar_confirmed:boolean;length_definition:'total_length_straight_line'};
export type MeasurementResult = {status:string;method:string;length_cm:number;fish_length_px:number;reference_length_px:number;reference_length_cm:number;cm_per_pixel:number;calibration_validity:string;ground_truth_accuracy_validated:boolean;warning:string};
export async function segmentFish(file:File):Promise<SegmentResult>{
  const fd=new FormData();fd.append('image',file);
  return checked<SegmentResult>(await fetch('/api/v1/ml/segment?conf=0.15&imgsz=512',{method:'POST',body:fd}));
}
export async function measureFish(payload:MeasurementInput):Promise<MeasurementResult>{
  return checked<MeasurementResult>(await fetch('/api/v1/measure',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}));
}
