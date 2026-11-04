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
    q: '¿Cuánto cuesta desarrollar un sistema?',
    a: 'Depende sobre todo de cuántos módulos y tipos de usuario tenga, de las integraciones con otros sistemas, de los datos que haya que migrar y de los plazos. Por eso preparamos la cotización después de definir el alcance, y en proyectos grandes la dividimos por fases para que puedas empezar con una primera versión.',
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
    a: 'No. Spark Assistant da una orientación según tus respuestas, a partir de reglas fijas y sin inteligencia artificial. La cotización se prepara después de conversar sobre el proyecto.',
  },
  {
    topic: 'proyecto',
    q: '¿Cómo empieza un proyecto?',
    a: 'Con una conversación para entender el objetivo, seguida de un levantamiento de requisitos y una propuesta con alcance, fases y cotización. El desarrollo empieza cuando la propuesta está aprobada.',
  },
  {
    topic: 'proyecto',
    q: '¿Qué tipo de proyectos desarrollan?',
    a: 'Sitios web corporativos y comerciales, tiendas en línea, aplicaciones web, sistemas de gestión como ERP y CRM, dashboards, APIs, integraciones entre sistemas, automatización de procesos y software a medida. También mejoramos y ampliamos productos que ya existen.',
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
    q: '¿Puedo pedir funcionalidades personalizadas?',
    a: 'Sí. Los planes son un punto de partida: cualquier funcionalidad específica se analiza en el levantamiento de requisitos y se incluye en la propuesta con su alcance y su coste.',
  },
  {
    topic: 'proyecto',
    q: '¿Pueden ampliar un sistema que ya tengo?',
    a: 'Sí, después de revisar el código, la documentación y la infraestructura actual. Con esa revisión te decimos si conviene ampliarlo tal como está, mejorar primero algunas partes o, en casos puntuales, reemplazar un módulo.',
  },
  {
    topic: 'proyecto',
    q: '¿Ofrecen mantenimiento y soporte?',
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
    q: '¿Pueden integrar sistemas que ya uso?',
    a: 'Sí, cuando el sistema ofrece una API, exportaciones de datos o acceso a su base de datos. Primero evaluamos qué permite cada herramienta y qué datos deben sincronizarse, y en función de eso proponemos la integración.',
  },
  {
    topic: 'tecnico',
    q: '¿Quién es el propietario del código?',
    a: 'Se acuerda por escrito en el contrato antes de empezar: qué se entrega (código fuente, repositorio, documentación y accesos) y en qué condiciones. Así no quedan dudas al finalizar el proyecto.',
  },
  {
    topic: 'tecnico',
    q: '¿Las demostraciones son productos listos para usar?',
    a: 'No. Las demostraciones muestran el tipo de interfaz que podemos construir, con datos ficticios que viven solo en tu navegador. Cada sistema real se desarrolla a partir de los requisitos del cliente.',
  },
];
