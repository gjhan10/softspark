export interface Faq {
  q: string;
  a: string;
  topic: 'planes' | 'proyecto' | 'tecnico';
}

export const FAQ_TOPICS: { id: Faq['topic']; label: string }[] = [
  { id: 'planes', label: 'Planes y costes' },
  { id: 'proyecto', label: 'Cómo trabajamos' },
  { id: 'tecnico', label: 'Aspectos técnicos' },
];

export const FAQS: Faq[] = [
  {
    topic: 'planes',
    q: '¿Por qué no hay precios publicados?',
    a: 'Cada proyecto cambia según el alcance, el contenido, las integraciones y los plazos. Preferimos cotizar después de entender lo que necesitas antes que publicar una cifra que luego no se cumpla.',
  },
  {
    topic: 'planes',
    q: '¿El plan incluye hosting y dominio?',
    a: 'No necesariamente. El hosting, el dominio y los servicios de terceros pueden tener costes y condiciones separados. En la cotización se detalla qué está incluido y qué se contrata aparte.',
  },
  {
    topic: 'planes',
    q: '¿Qué significa "Opcional" y "Sujeto a evaluación" en la tabla de planes?',
    a: '"Opcional" es una característica que se puede añadir y se cotiza aparte. "Sujeto a evaluación" significa que depende de los requisitos técnicos y se confirma tras analizar el proyecto.',
  },
  {
    topic: 'planes',
    q: '¿La recomendación del asistente es una cotización?',
    a: 'No. El asistente "Encuentra la solución adecuada" da una orientación según tus respuestas. La cotización se prepara después de conversar sobre el proyecto.',
  },
  {
    topic: 'proyecto',
    q: '¿Cómo empieza un proyecto?',
    a: 'Con una conversación para entender el objetivo, seguida de un levantamiento de requisitos y una propuesta con alcance, fases y cotización. El desarrollo empieza cuando la propuesta está aprobada.',
  },
  {
    topic: 'proyecto',
    q: '¿Cuánto tarda un proyecto?',
    a: 'Depende del alcance. Una landing page y un sistema de gestión tienen plazos muy distintos. El plazo se estima en la propuesta y, en proyectos grandes, se divide en fases.',
  },
  {
    topic: 'proyecto',
    q: '¿Se puede empezar con algo pequeño y crecer después?',
    a: 'Sí, y suele ser lo recomendable: empezar con una primera versión acotada y ampliarla según el uso real. La arquitectura se plantea pensando en ese crecimiento.',
  },
  {
    topic: 'proyecto',
    q: '¿Ofrecen mantenimiento?',
    a: 'El mantenimiento y las mejoras posteriores se pueden acordar como un servicio aparte, con condiciones definidas en el contrato.',
  },
  {
    topic: 'tecnico',
    q: '¿Cuál es la diferencia entre un ERP y un CRM?',
    a: 'Un ERP gestiona los procesos y recursos de la empresa: inventario, compras, ventas o finanzas. Un CRM se centra en los clientes, las oportunidades y la relación comercial. Muchas empresas empiezan por uno y lo conectan con el otro.',
  },
  {
    topic: 'tecnico',
    q: '¿Un sitio estático puede tener formularios?',
    a: 'Puede mostrar el formulario y validarlo, pero no recibe ni almacena los datos por sí solo. Para eso se conecta a un proveedor de formularios o a una API propia.',
  },
  {
    topic: 'tecnico',
    q: '¿Las demostraciones son productos listos para usar?',
    a: 'No. Las demostraciones muestran el tipo de interfaz que podemos construir, con datos ficticios que viven solo en tu navegador. Cada sistema real se desarrolla a partir de los requisitos del cliente.',
  },
];
