/* CatCard — category tile. Ported from artifact lines 1063-1084. */

function VocabCatCard(props) {
  var c = props.c, cnt = props.cnt, onClick = props.onClick, active = props.active;
  return e("div", {onClick: onClick,
    style:{padding:"14px 12px",
           background: active
             ? "linear-gradient(135deg, "+c.c+"18 0%, "+c.c+"06 100%)"
             : "linear-gradient(135deg, rgba(13,18,36,.8) 0%, rgba(13,18,36,.4) 100%)",
           border:"1px solid " + (active ? c.c+"77" : C.bd),
           borderRadius:"14px", cursor:"pointer",
           transition:"all .25s", position:"relative", overflow:"hidden"}
  },
    active && e("div", {style:{position:"absolute", top:0, left:0, right:0,
                               height:"2px",
                               background:"linear-gradient(90deg,"+c.c+",transparent)"}}),
    e("div", {style:{fontSize:"26px", marginBottom:"6px",
                     filter: active ? "none" : "grayscale(.2)"}}, c.i),
    e("div", {style:{fontSize:"12px", fontWeight:700, color:C.tx,
                     marginBottom:"3px", lineHeight:"1.2"}}, c.n),
    e("div", {style:{fontSize:"10px", color:C.mt,
                     lineHeight:"1.3", marginBottom:"7px"}}, c.d),
    e("div", {style:{display:"inline-flex", padding:"2px 7px",
                     background:c.c+"22", color:c.c,
                     borderRadius:"5px", fontSize:"10px", fontWeight:700}}, cnt)
  );
}
