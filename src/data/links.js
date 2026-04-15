// Cross-reference links and module definitions
var LINKS={
  "anat_inguinal":{vista:"cir_ing",label:"Anatomía Inguinal",materia:"Anatomía"},
  "anat_craneales":{vista:"anat",label:"Pares Craneales",materia:"Anatomía"},
  "gen_coag":{vista:"general",label:"Factores de Coagulación",materia:"Generalidades"},
  "gen_inmuno":{vista:"general",label:"Bases Inmunológicas",materia:"Generalidades"},
  "lab_coag":{vista:"labs",label:"Valores de Coagulación",materia:"Laboratorios"},
  "fisio_receptores":{vista:"fisio",label:"Receptores Adrenérgicos",materia:"Fisiología"},
  "epid_sesgos":{vista:"epid",label:"Sesgos",materia:"Epidemiología"},
  "calc_parkland":{vista:"cir_quem",label:"Calculadora de Parkland",materia:"Emergenciología"},
  "calc_goteo":{vista:"cir_quem",label:"Calculadora de Goteo",materia:"Emergenciología"},
  "triadas_all":{vista:"triadas",label:"Tríadas y Síndromes",materia:"Tríadas"}
};

var MODS=[
{id:"reuma",n:"Reumatología",ic:"🦴",col:"#60a5fa",d:"AR, AIJ, Sjögren, EA, Esclerodermia, SAF, Fibromialgia",st:"lleno"},
{id:"cirugia",n:"Cirugía",ic:"🔪",col:"#ef4444",d:"Abdomen agudo, Hernias inguinales",st:"lleno"},
{id:"anatomia",n:"Anatomía",ic:"🩻",col:"#f59e0b",d:"12 Pares Craneales, Conducto Inguinal, Cordón Espermático",st:"lleno"},
{id:"general",n:"Generalidades",ic:"📚",col:"#8b5cf6",d:"Inmunología, Cascada de Coagulación, Vocabulario Médico, y más",st:"lleno"},
{id:"epid",n:"Epidemiología (Salud Pública)",ic:"📊",col:"#00b4d8",d:"Tipos de estudio, Pirámide de evidencia, Sesgos, Medidas, Lectura crítica",st:"lleno"},
{id:"triadas",n:"Tríadas y Síndromes",ic:"🔺",col:"#e879f9",d:TR.length+" asociaciones clásicas multidisciplinarias",st:"lleno"},
{id:"labs",n:"Valores de Laboratorio",ic:"📊",col:"#4caf82",d:"Hemograma, Coagulación, Hepáticas, Renal, Ionograma, Tiroides",st:"lleno"},
{id:"imagenes",n:"Imágenes Diagnósticas",ic:"📷",col:"#06b6d4",d:"Rx, Ecografía, TAC, RM — Próximamente",st:"vacío"},
{id:"cardio",n:"Cardiología",ic:"🫀",col:"#ef4444",d:"Insuficiencia cardíaca, Valvulopatías, Arritmias",st:"vacío"},
{id:"neumo",n:"Neumología",ic:"🫁",col:"#06b6d4",d:"EPOC, Asma, Neumonías, TEP",st:"vacío"},
{id:"neuro",n:"Neurología",ic:"🧠",col:"#a78bfa",d:"ACV, Meningitis, Epilepsia",st:"vacío"},
{id:"nefro",n:"Nefrología",ic:"🫘",col:"#f59e0b",d:"IRA, IRC, Sd Nefrótico",st:"vacío"},
{id:"infecto",n:"Infectología",ic:"🦠",col:"#34d399",d:"Bacterianas, Virales, Parasitarias",st:"vacío"},
{id:"farma",n:"Farmacología",ic:"💊",col:"#8b5cf6",d:"Farmacocinética, Farmacodinamia",st:"vacío"},
{id:"gastro",n:"Gastroenterología",ic:"🍽️",col:"#fb923c",d:"Hepatopatías, EAP",st:"vacío"},
{id:"endoc",n:"Endocrinología",ic:"⚗️",col:"#06b6d4",d:"Diabetes, Tiroides",st:"vacío"},
{id:"hema",n:"Hematología",ic:"🩸",col:"#dc2626",d:"Anemias, Leucemias",st:"vacío"},
{id:"fisio",n:"Fisiología",ic:"🔬",col:"#ec4899",d:"Receptores adrenérgicos, SNA simpático, Proteínas G",st:"lleno"},
{id:"emergen",n:"Emergenciología",ic:"🚑",col:"#ef4444",d:"Algoritmo de quemaduras, ATLS, RCP, Shock",st:"lleno"},
{id:"dermato",n:"Dermatología",ic:"🧴",col:"#f472b6",d:"Dermatitis, Tumores",st:"vacío"},
{id:"trauma",n:"Traumatología",ic:"🦴",col:"#78716c",d:"Fracturas, Luxaciones",st:"vacío"}
];
