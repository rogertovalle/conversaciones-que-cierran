
window.RUEDA_DATOS = {
  
  niveles: [
    { n: 1, q: "¿qué pasó?", ia: .15 },
    { n: 2, q: "¿qué significa lo que pasó?", ia: .25 },
    { n: 3, q: "¿qué está pasando?", ia: .4 },
    { n: 4, q: "¿qué impacto tiene?", ia: .5 },
    { n: 5, q: "¿qué pasaría?", ia: .65 },
    { n: 6, q: "autonomía agéntica decisional", ia: .85 },
    { n: 7, q: "repensar — humano", ia: 0 },
  ],

  escenas: [
    
    { id: "grieta", titulo: "La grieta", paso: 1, fx: {},
      marca: ["ilustrativo", ""],
      fuente: "",
      cam: [995, 735, 1220, 620], camN: [960, 735, 1240, 760],
      beats: [0, 5000, 10500, 15500],
      coreo: [
        [200, "#gr-org", "dib"], [500, "#gr-org2", "dib"], [1700, "#gr-org-etq", "vis"], [2000, "#gr-chispa", "vis"],
        [5000, "#gr-titular", "vis"], [5400, "#gr-c1", "vis"], [6300, "#gr-c2", "vis"], [7200, "#gr-c3", "vis"],
        [10500, "#gr-l1", "dib"], [10800, "#gr-l2", "dib"], [11100, "#gr-l3", "dib"],
        [13000, "#gr-chispa", "retira"], [13200, "#gr-hueco", "vis"],
        [15500, "#gr-grieta", "dib"], [15700, "#gr-grieta2", "dib"], [17500, "#gr-pregunta", "vis"],
      ] },

    
    { id: "tesis", titulo: "La tesis", paso: 2, fx: { sello: true },
      marca: ["canon", ""],
      fuente: "",
      cam: [1155, 765, 1100, 640], camN: [1120, 765, 1140, 700],
      beats: [0, 3000, 15500],
      coreo: [
        [3000, "#lec-rostros", "vis"], [6500, "#lec-chispa", "vis"], [10500, "#lec-lente", "vis"],
        [13000, "#lec-circulo", "vis"], [15500, "#lec-tesis", "vis"],
      ] },

    
    { id: "circulo", titulo: "El círculo: riesgo y valor", paso: 3, fx: { foco: true },
      marca: ["prestamo", ""],
      fuente: "",
      cam: [1092, 721, 1000, 1000],
      beats: [0, 4500, 11500],
      coreo: [
        [4500, "#c300", "dib"], [4500, "#comp300", "gira"], [7000, "#c260", "dib"], [7000, "#comp260", "gira"],
        [9000, '[data-ensayo="borde-5"]', "vis"],
        [11500, "#c190", "dib"], [11500, "#comp190", "gira"], [13500, "#c150", "dib"], [13500, "#comp150", "gira"],
        [15300, '[data-ensayo="borde-9"]', "vis"],
      ] },

    
    { id: "conversaciones", titulo: "Las cuatro conversaciones", paso: 5, fx: { foco: true },
      marca: ["sintesis", ""],
      fuente: "",
      cam: [1092, 721, 1000, 1000],
      beats: [0, 8000, 10000],
      coreo: [
        [1000, '[data-ensayo="p8"]', "vis"], [1350, '[data-ensayo="p10"]', "vis"], [1700, '[data-ensayo="p7"]', "vis"],
        [2050, '[data-ensayo="p6"]', "vis"], [2400, '[data-ensayo="p4"]', "vis"], [2750, '[data-ensayo="p2"]', "vis"],
        [3100, '[data-ensayo="p1"]', "vis"], [3450, '[data-ensayo="p3"]', "vis"],
        [8000, '[data-ensayo="conv-vision"]', "vis"], [8400, '[data-ensayo="conv-articulacion"]', "vis"],
        [8800, '[data-ensayo="conv-oportunidad"]', "vis"], [9200, '[data-ensayo="conv-monetizacion"]', "vis"],
        [10000, "@conv", "vision"], [13000, "@conv", "articulacion"], [16000, "@conv", "oportunidad"],
        [18500, "@conv", "monetizacion"], [22500, "@conv", "todas"],
      ] },

    
    { id: "cuadrado", titulo: "El cuadrado: la estructura", paso: 7, fx: { foco: true },
      marca: ["prestamo", ""],
      fuente: "",
      cam: [1092, 721, 860, 860],
      beats: [0, 4800, 12500],
      coreo: [
        [500, "#k1", "dib"], [500, "#lz1", "corre"], [1100, "#k3", "dib"], [1100, "#lz3", "corre"],
        [1700, "#k2", "dib"], [1700, "#lz2", "corre"], [2300, "#k4", "dib"], [2300, "#lz4", "corre"],
        [4800, "#cuadrado", "dib"], [6600, "#cuadrado", "asienta"], [6600, "#g-cortes [data-paso]", "retira"],
        [9000, "@cam", [1092, 721, 470, 470]],
        [12500, '[data-ensayo="dm2"]', "vis"], [12500, "@esquina", "dm2"],
        [14000, '[data-ensayo="dm1"]', "vis"], [14000, "@esquina", "dm1"],
        [15500, '[data-ensayo="dm4"]', "vis"], [15500, "@esquina", "dm4"],
        [17000, '[data-ensayo="dm3"]', "vis"], [17000, "@esquina", "dm3"],
        [20500, "@esquina", "ninguna"],
      ] },

    
    { id: "corazon", titulo: "El corazón: la habilitación", paso: 9, fx: { foco: true },
      marca: ["canon", ""],
      fuente: "",
      cam: [1092, 715, 640, 640],
      beats: [0, 8000, 14500],
      coreo: [
        [800, "#rombo", "dib"], [2600, "#rombo", "asienta"],
        [7000, "@cam", [1092, 722, 430, 420]],
        [8000, "#tri1", "dib"], [9000, "#tri2", "dib"],
        [10200, '[data-ensayo="m-personas"]', "vis"], [11000, '[data-ensayo="m-tecnologia"]', "vis"],
        [11800, '[data-ensayo="m-procesos"]', "vis"],
        [14500, '[data-ensayo="z-formacion"]', "vis"], [16000, '[data-ensayo="z-gobernanza"]', "vis"],
        [17500, '[data-ensayo="z-estrategia"]', "vis"],
      ] },

    
    { id: "piramide", titulo: "Siete preguntas", paso: 12, fx: { foco: true },
      marca: ["canon", ""],
      fuente: "",
      cam: [1250, 662, 600, 340], camN: [1092, 668, 300, 330],
      beats: [0, 4500, 14500, 20000],
      coreo: [
        [300, "#g-pir .tr", "dib"],
        [4500, '[data-ensayo="n1"]', "vis"], [4500, "@nivel", 1],
        [6000, '[data-ensayo="n2"]', "vis"], [6000, "@nivel", 2],
        [7500, '[data-ensayo="n3"]', "vis"], [7500, "@nivel", 3],
        [9000, '[data-ensayo="n4"]', "vis"], [9000, "@nivel", 4],
        [10500, '[data-ensayo="n5"]', "vis"], [10500, "@nivel", 5],
        [14500, '[data-ensayo="n6"]', "vis"], [14500, "@nivel", 6],
        [20000, '[data-ensayo="n7"]', "vis"], [20000, "@nivel", 7],
      ] },

    
    { id: "onda", titulo: "La onda de crecimiento — y el freno", paso: 13, fx: { foco: true },
      marca: ["canon", ""],
      fuente: "",
      cam: [1092, 721, 1080, 1080],
      beats: [0, 2500, 17500, 21000],
      coreo: [
        [2500, '[data-ensayo="m-personas"]', "resalta"],
        [4000, "#rombo", "resalta"], [4000, "#rombo", "estira"],
        [5500, '[data-ensayo="conv-vision"]', "resalta"], [5500, '[data-ensayo="conv-vision"]', "sube"],
        [7000, "#c150", "presiona9"], [7000, "#c190", "presiona9b"], [7000, '[data-ensayo="borde-9"]', "resalta"], [7000, "#c150", "resalta"],
        [8500, '[data-ensayo="p8"]', "comprime"], [8500, '[data-ensayo="p8"]', "resalta"],
        [10000, "#c300", "empuja5"], [10000, "#c260", "empuja5b"], [10000, '[data-ensayo="borde-5"]', "resalta"], [10000, "#c300", "resalta"],
        [11800, '#g-empuje [data-paso="13"]', "dib"], [11800, "#g-empuje .ap", "vis"],
        [12800, "#lamina", "crece"],
        [17500, "@etapa", { paso: 14, fx: { cadencia: true, latir: true }, cam: [1092, 721, 1000, 1000] }],
        [21000, "@cad", "runaway"],
      ] },

    
    { id: "ecosistema", titulo: "De la parte al ecosistema", paso: 15, fx: { cadencia: true },
      marca: ["desarrollo", ""],
      fuente: "",
      cam: [1350, 780, 1560, 1000], camN: [1092, 721, 1000, 1000],
      beats: [0, 5000, 10500, 15500, 19500],
      coreo: [
        [5000, "#g-eco .tr", "dib"], [6500, "#eco-socios", "vis"], [6500, "@eco", "federar"], [7500, "#eco-etq-molecula", "vis"],
        [10500, "@cam", [2430, 900, 720, 560]], [11000, "#eco-esfera", "vis"],
        [15500, "@cam", [[1720, 870, 2280, 1000], [2230, 900, 1250, 1150]]], [16500, "#eco-red2-g", "vis"],
        [19500, "@eco", "extraer"], [26000, "@eco", "federar"],
      ] },

    
    { id: "frontera", titulo: "Lo probado y la frontera", paso: 18, fx: { foco: true, latir: true, cadencia: true },
      marca: ["canon", ""],
      fuente: "",
      cam: [1150, 925, 1940, 1060], camN: [1092, 930, 1500, 1120],
      beats: [0, 3000, 9000, 18500],
      coreo: [
        [3000, "#led-safe", "vis"], [3000, "#c300", "resalta"], [3000, "#c260", "resalta"],
        [5500, "#led-dm", "vis"], [5500, "#cuadrado", "resalta"],
        [9000, "#led-conv", "vis"], [11500, "#led-frontera", "vis"], [14000, "#led-n1", "vis"],
        [18500, "#led-pregunta", "vis"],
      ] },
  ],
};
