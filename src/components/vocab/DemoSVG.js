/* DemoSVG — router that picks the right SVG renderer by demo.type.
   type: "neck" | "heart" | "abd" | "word" (default) */

function DemoSVG(props) {
  var type = props.type;
  if (type === "neck")  return e(NeckSVG,  {step: props.step, p: props.p});
  if (type === "heart") return e(HeartSVG, {step: props.step, p: props.p});
  if (type === "abd")   return e(AbdSVG,   {step: props.step, p: props.p});
  return e(WordSVG, {step: props.step, p: props.p});
}
