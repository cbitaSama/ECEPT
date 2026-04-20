
// ══════════════════════════════════════════════════════════════
// BUSCADOR GLOBAL · índice de enfermedades/temas
// ══════════════════════════════════════════════════════════════

// Índice de búsqueda — enfermedades, temas y conceptos clave
var SEARCH_INDEX=[
  // Psicosis
  {q:"psicótico breve trastorno",label:"Trastorno psicótico breve",bloc:"Psicosis",route:"psicosis",icon:"🔺",color:"#ef4444"},
  {q:"esquizofreniforme",label:"Trastorno esquizofreniforme",bloc:"Psicosis",route:"psicosis",icon:"🔺",color:"#a855f7"},
  {q:"esquizofrenia",label:"Esquizofrenia",bloc:"Psicosis",route:"psicosis",icon:"🧠",color:"#a855f7"},
  {q:"esquizoafectivo",label:"Trastorno esquizoafectivo",bloc:"Psicosis",route:"psicosis",icon:"🔺",color:"#a855f7"},
  {q:"delirante paranoide",label:"Trastorno delirante",bloc:"Psicosis",route:"psicosis",icon:"🎭",color:"#f87171"},
  {q:"bipolar tipo 1 manía",label:"Trastorno bipolar I",bloc:"Psicosis",route:"psicosis",icon:"⚡",color:"#fbbf24"},
  {q:"bipolar tipo 2 hipomanía",label:"Trastorno bipolar II",bloc:"Psicosis",route:"psicosis",icon:"⚡",color:"#fbbf24"},
  {q:"ciclotímico ciclotimia",label:"Trastorno ciclotímico",bloc:"Psicosis",route:"psicosis",icon:"🌊",color:"#fbbf24"},
  {q:"depresión mayor episodio",label:"Episodio depresivo mayor (en Bipolar)",bloc:"Psicosis",route:"psicosis",icon:"💧",color:"#38bdf8"},
  {q:"clozapina olanzapina risperidona antipsicótico",label:"Antipsicóticos atípicos",bloc:"Psicosis",route:"psicosis",icon:"💊",color:"#ef4444"},
  {q:"haloperidol clorpromazina neuroléptico típico",label:"Antipsicóticos típicos",bloc:"Psicosis",route:"psicosis",icon:"💊",color:"#ef4444"},
  {q:"litio estabilizador",label:"Litio (estabilizador)",bloc:"Psicosis",route:"psicosis",icon:"💊",color:"#fbbf24"},
  {q:"dopamina vías mesolímbica nigroestriada",label:"4 vías dopaminérgicas",bloc:"Psicosis",route:"psicosis",icon:"🧠",color:"#ef4444"},

  // Intro
  {q:"psiquiatría oms salud mental definición",label:"Definiciones OMS",bloc:"Psiquiatría",route:"intro",icon:"🏥",color:"#94a3b8"},
  {q:"psicosis vs neurosis diferencia",label:"Psicosis vs Neurosis",bloc:"Psiquiatría",route:"intro",icon:"⚖️",color:"#94a3b8"},
  {q:"historia psiquiatría clorpromazina",label:"Historia de la psiquiatría",bloc:"Psiquiatría",route:"intro",icon:"📜",color:"#94a3b8"},
  {q:"causas biopsicosocial",label:"Causas de trastornos mentales",bloc:"Psiquiatría",route:"intro",icon:"🔬",color:"#94a3b8"},
  {q:"tratamiento pilares psicoterapia",label:"3 pilares del tratamiento",bloc:"Psiquiatría",route:"intro",icon:"💊",color:"#94a3b8"},

  // Neurosis · Ansiedad
  {q:"ansiedad pánico ataque",label:"Trastorno de pánico",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"agorafobia",label:"Agorafobia",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"TAG ansiedad generalizada",label:"Trastorno de ansiedad generalizada",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"fobia específica",label:"Fobia específica",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"fobia social ansiedad social",label:"Ansiedad social",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},
  {q:"mutismo selectivo",label:"Mutismo selectivo",bloc:"Ansiedad",route:"anx",icon:"🫀",color:"#60a5fa"},

  // TOC
  {q:"TOC obsesivo compulsivo obsesión",label:"TOC (Trastorno obsesivo-compulsivo)",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"TDC dismórfico corporal",label:"Trastorno dismórfico corporal",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"hoarding acumulación",label:"Trastorno de acumulación",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"tricotilomanía pelo",label:"Tricotilomanía",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"excoriación piel",label:"Excoriación",bloc:"TOC",route:"toc",icon:"🔁",color:"#a78bfa"},
  {q:"PANDAS streptococo",label:"PANDAS",bloc:"TOC",route:"toc",icon:"🦠",color:"#a78bfa"},

  // Trauma
  {q:"TEPT estrés postraumático trauma",label:"Trastorno de estrés postraumático (TEPT)",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"TEA estrés agudo",label:"Trastorno de estrés agudo (TEA)",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"adaptación trastorno",label:"Trastorno adaptativo",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"duelo prolongado complicado",label:"Duelo prolongado",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},
  {q:"prazosina pesadillas",label:"Prazosina (pesadillas TEPT)",bloc:"Trauma",route:"trm",icon:"💊",color:"#fb923c"},
  {q:"EMDR desensibilización",label:"EMDR",bloc:"Trauma",route:"trm",icon:"⚡",color:"#fb923c"},

  // Somáticos
  {q:"TSS síntomas somáticos",label:"Trastorno de síntomas somáticos",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"IAD hipocondría enfermedad ansiedad",label:"IAD (ansiedad por enfermedad)",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"conversión funcional neurológico",label:"Trastorno de conversión",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"Hoover signo parálisis",label:"Signo de Hoover",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"facticio Munchausen",label:"Trastorno facticio",bloc:"Somáticos",route:"som",icon:"🧬",color:"#34d399"},
  {q:"TID identidad disociativo múltiple personalidad",label:"Trastorno de identidad disociativo",bloc:"Disociativos",route:"som",icon:"🧬",color:"#f472b6"},
  {q:"amnesia disociativa fuga",label:"Amnesia disociativa",bloc:"Disociativos",route:"som",icon:"🧬",color:"#f472b6"},
  {q:"despersonalización desrealización",label:"Despersonalización / desrealización",bloc:"Disociativos",route:"som",icon:"🧬",color:"#f472b6"},

  // TCA
  {q:"anorexia nerviosa AN IMC",label:"Anorexia nerviosa",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"bulimia atracón purga vómito",label:"Bulimia nerviosa",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"trastorno atracón binge",label:"Trastorno por atracón",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"ARFID evitación restricción",label:"ARFID",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"pica pagofagia hielo ferritina",label:"Pica",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"rumiación regurgitación",label:"Trastorno de rumiación",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"Russell signo nudillos vómito",label:"Signo de Russell",bloc:"TCA",route:"tca",icon:"🍽️",color:"#ec4899"},
  {q:"fluoxetina bulimia",label:"Fluoxetina en bulimia",bloc:"TCA",route:"tca",icon:"💊",color:"#ec4899"},
  {q:"Maudsley terapia familiar",label:"Terapia Maudsley (AN adolescentes)",bloc:"TCA",route:"tca",icon:"💊",color:"#ec4899"},

  // Sueño
  {q:"insomnio dificultad dormir",label:"Trastorno de insomnio",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"hipersomnia somnolencia diurna",label:"Hipersomnia",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"narcolepsia cataplejía orexina",label:"Narcolepsia",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"apnea obstructiva AOS CPAP",label:"Apnea obstructiva del sueño",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"SPI piernas inquietas Willis Ekbom",label:"Síndrome de piernas inquietas",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"sonambulismo terror nocturno NREM",label:"Sonambulismo / terror nocturno",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"pesadillas REM",label:"Trastorno de pesadillas",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"TCSR REM conducta actúa sueños",label:"TCSR (conducta del sueño REM)",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},
  {q:"ritmo circadiano melatonina",label:"Ritmo circadiano",bloc:"Sueño",route:"sue",icon:"🌙",color:"#22d3ee"},

  // Personalidad
  {q:"paranoide personalidad desconfianza",label:"Paranoide (Cluster A)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"esquizoide solo aislado",label:"Esquizoide (Cluster A)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"esquizotípica excéntrico",label:"Esquizotípica (Cluster A)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"antisocial psicópata",label:"Antisocial (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"TLP límite borderline escisión autolesión",label:"TLP (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"histriónica atención",label:"Histriónica (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"narcisista grandiosidad",label:"Narcisista (Cluster B)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"evitativa fobia social tímida",label:"Evitativa (Cluster C)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"dependiente sumisa",label:"Dependiente (Cluster C)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"TOCP obsesivo compulsiva perfeccionista",label:"TOCP (Cluster C)",bloc:"Personalidad",route:"per",icon:"🎭",color:"#facc15"},
  {q:"DBT Linehan dialéctica",label:"DBT (1ª línea TLP)",bloc:"Personalidad",route:"per",icon:"💊",color:"#facc15"},

  // Impulsos
  {q:"negativista desafiante niño",label:"Trastorno negativista desafiante",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"TEI explosivo intermitente ira",label:"Trastorno explosivo intermitente",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"conducta trastorno CC violación normas",label:"Trastorno de la conducta",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"piromanía fuego incendio",label:"Piromanía",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},
  {q:"cleptomanía robo impulso",label:"Cleptomanía",bloc:"Impulsos",route:"imp",icon:"🎯",color:"#f97316"},

  // Depresivos
  {q:"TDM depresión mayor SIGECAPS",label:"Trastorno depresivo mayor (TDM)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"distimia persistente crónica",label:"Depresivo persistente (distimia)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"TDPM premenstrual disfórico",label:"TDPM (disfórico premenstrual)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"TDDD desregulación disruptiva niño",label:"TDDD (niños)",bloc:"Depresivos",route:"dpr",icon:"💧",color:"#818cf8"},
  {q:"ISRS sertralina fluoxetina escitalopram",label:"ISRS (1ª línea depresión)",bloc:"Depresivos",route:"dpr",icon:"💊",color:"#818cf8"},
  {q:"TEC electroconvulsiva refractaria",label:"TEC (terapia electroconvulsiva)",bloc:"Depresivos",route:"dpr",icon:"💊",color:"#818cf8"},
  {q:"ketamina refractaria suicidalidad",label:"Ketamina / esketamina",bloc:"Depresivos",route:"dpr",icon:"💊",color:"#818cf8"}
];

function GlobalSearch(p){
  var s1=useState("");var query=s1[0],setQuery=s1[1];
  var s2=useState(false);var focused=s2[0],setFocused=s2[1];

  var qLow=query.trim().toLowerCase();
  var results=qLow.length<2?[]:SEARCH_INDEX.filter(function(it){
    return it.q.toLowerCase().indexOf(qLow)>=0 || it.label.toLowerCase().indexOf(qLow)>=0 || it.bloc.toLowerCase().indexOf(qLow)>=0;
  }).slice(0,12);

  function handleClick(route){
    setQuery("");
    setFocused(false);
    if(p.go)p.go(route);
  }

  return e("div",{style:{position:"relative",marginBottom:18}},
    e("div",{style:{position:"relative"}},
      e("div",{style:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none",opacity:.6}},"🔍"),
      e("input",{
        type:"text",value:query,
        onChange:function(ev){setQuery(ev.target.value);},
        onFocus:function(){setFocused(true);},
        onBlur:function(){setTimeout(function(){setFocused(false);},200);},
        placeholder:"Buscar enfermedad, fármaco, concepto...",
        style:{width:"100%",padding:"12px 14px 12px 40px",background:C.cd,border:"1px solid "+(focused?ax(C.anx,.5):C.bd),borderRadius:12,color:C.tx,fontSize:13.5,fontFamily:"inherit",boxSizing:"border-box",transition:"border-color .15s ease"}
      }),
      query?e("button",{
        onClick:function(){setQuery("");},
        style:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",padding:"4px 8px",background:"transparent",color:C.mt,fontSize:14,borderRadius:6,cursor:"pointer"}
      },"✕"):null
    ),
    (focused && results.length>0)?e("div",{style:{position:"absolute",top:"100%",left:0,right:0,marginTop:6,background:C.cd,border:"1px solid "+C.bd,borderRadius:12,maxHeight:380,overflowY:"auto",zIndex:90,boxShadow:"0 10px 30px rgba(0,0,0,.4)",animation:"fadeIn .15s"}},
      results.map(function(r,i){
        return e("button",{
          key:i,
          onMouseDown:function(ev){ev.preventDefault();handleClick(r.route);},
          style:{width:"100%",padding:"10px 14px",background:"transparent",border:"none",borderBottom:i<results.length-1?"1px solid "+C.bd:"none",color:C.tx,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .1s ease"}
        },
          e("span",{style:{fontSize:18,flexShrink:0}},r.icon),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},r.label),
            e("div",{style:{fontSize:10.5,color:r.color,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}},r.bloc)
          ),
          e("span",{style:{fontSize:13,color:r.color,fontWeight:300}},"›")
        );
      })
    ):null,
    (focused && qLow.length>=2 && results.length===0)?e("div",{style:{position:"absolute",top:"100%",left:0,right:0,marginTop:6,background:C.cd,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 14px",textAlign:"center",zIndex:90,boxShadow:"0 10px 30px rgba(0,0,0,.4)"}},
      e("div",{style:{fontSize:20,marginBottom:6,opacity:.5}},"🔍"),
      e("div",{style:{fontSize:12,color:C.mt}},"Sin resultados para \"",query,"\"")
    ):null
  );
}

