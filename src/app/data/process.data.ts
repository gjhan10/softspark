export interface ProcessStep {
  title: string;
  desc: string;
  output: string;
}

export const PROCESS: ProcessStep[] = [
  {
    title: 'Conversación inicial',
    desc: 'Entendemos el objetivo, el contexto del negocio y lo que ya existe.',
    output: 'Una idea clara del problema a resolver.',
  },
  {
    title: 'Levantamiento y alcance',
    desc: 'Definimos usuarios, funcionalidades, integraciones y prioridades.',
    output: 'Alcance documentado y lo que queda fuera.',
  },
  {
    title: 'Propuesta y cotización',
    desc: 'Proponemos la solución, las fases, los plazos y los costes, incluidos los servicios de terceros.',
    output: 'Propuesta para revisar y aprobar.',
  },
  {
    title: 'Diseño',
    desc: 'Estructura, flujos y diseño visual validados antes de programar.',
    output: 'Pantallas o prototipos aprobados.',
  },
  {
    title: 'Desarrollo por iteraciones',
    desc: 'Construimos por partes y compartimos avances que puedes probar.',
    output: 'Versiones funcionales en cada iteración.',
  },
  {
    title: 'Pruebas y entrega',
    desc: 'Verificamos en distintos dispositivos, corregimos y publicamos.',
    output: 'Producto publicado y documentación de uso.',
  },
  {
    title: 'Evolución',
    desc: 'Mejoras, nuevas funcionalidades y mantenimiento, si se acuerdan.',
    output: 'Un producto que crece con el negocio.',
  },
];
