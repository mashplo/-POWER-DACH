import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function CreatinaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creatina, setCreatina] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const obtenerCreatina = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/creatinas");
        const data = await response.json();
        const creatinaEncontrada = data.find((p) => p.id === parseInt(id));
        setCreatina(creatinaEncontrada);
      } catch (error) {
        console.error("Error al obtener creatina:", error);
        toast.error("Error al cargar el producto");
      }
    };
    obtenerCreatina();
  }, [id]);

  const siguienteImagen = () => {
    if (creatina && creatina.images) {
      setImagenActual((prev) => (prev + 1) % creatina.images.length);
    }
  };

  const imagenAnterior = () => {
    if (creatina && creatina.images) {
      setImagenActual(
        (prev) => (prev - 1 + creatina.images.length) % creatina.images.length
      );
    }
  };

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existe = carrito.find(
      (item) => item.id === creatina.id && item.tipo === "creatina"
    );

    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...creatina, cantidad: 1, tipo: "creatina" });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast.success("¡Agregado al carrito!");
  };

  if (!creatina) {
    return <div className="px-10 py-20">Cargando...</div>;
  }

  return (
    <div className="px-10 py-20">
      <button
        onClick={() => navigate("/productos")}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Productos
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Galería de imágenes */}
        <div className="lg:w-1/2">
          <div
            className="relative bg-base-200 rounded-lg overflow-hidden mb-4"
            style={{ height: "500px" }}
          >
            <img
              src={creatina.images[imagenActual]}
              alt={creatina.title}
              className="w-full h-full object-contain"
            />

            {creatina.images.length > 1 && (
              <>
                <button
                  onClick={imagenAnterior}
                  className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 bg-base-100/80 hover:bg-base-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={siguienteImagen}
                  className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 bg-base-100/80 hover:bg-base-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {creatina.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {creatina.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${creatina.title} ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    idx === imagenActual
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setImagenActual(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{creatina.title}</h1>
          <p className="text-4xl font-bold text-primary mb-6">
            S/{creatina.price}
          </p>

          <button onClick={agregarAlCarrito} className="btn btn-primary mb-8">
            Agregar al Carrito
          </button>

          <div className="divider"></div>

          <div
            className="overflow-y-auto flex-1 pr-4 space-y-6"
            style={{ maxHeight: "500px" }}
          >
            {creatina.id === 1 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    La Creatina 100% 1200 G de Optimum Nutrition es un
                    suplemento de monohidrato de creatina micronizada pura
                    diseñado para mejorar la fuerza, la potencia y el
                    rendimiento muscular en entrenamientos de moderada a alta
                    intensidad. Es un polvo sin sabor, lo que facilita su mezcla
                    con agua o cualquier otra bebida.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Características y Beneficios Principales
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Monohidrato de Creatina Pura:</strong> Contiene
                        100% monohidrato de creatina de alta calidad, uno de los
                        ingredientes más estudiados y efectivos en la nutrición
                        deportiva.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Micronizada para una Mejor Absorción:</strong>{" "}
                        El proceso de micronización reduce el tamaño de las
                        partículas del polvo, lo que mejora significativamente
                        su solubilidad y absorción en el organismo, optimizando
                        los resultados y reduciendo posibles molestias
                        gastrointestinales.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Aumento de Fuerza y Rendimiento:</strong>{" "}
                        Favorece la regeneración de ATP (trifosfato de
                        adenosina), la fuente de energía del organismo para los
                        músculos, lo que permite realizar movimientos explosivos
                        y series de ejercicio más intensas y duraderas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Promueve el Crecimiento Muscular:</strong> Ayuda
                        en la ganancia de masa muscular y mejora el volumen
                        celular (hidratación celular), lo cual, combinado con
                        entrenamiento de resistencia regular, apoya el
                        crecimiento magro.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Perfil Nutricional Limpio:</strong> No aporta
                        calorías, carbohidratos, grasas ni azúcares, lo que la
                        hace compatible con dietas específicas para aumentar
                        masa muscular magra o definir.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versátil y Combinable:</strong> Al ser sin
                        sabor, se puede mezclar fácilmente con batidos de
                        proteínas (como Gold Standard 100% Whey), jugos u otras
                        bebidas sin alterar su sabor.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Uso Sugerido
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis recomendada:</strong> 5 gramos diarios
                        (equivalente a una cucharadita pequeña).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Modo de empleo:</strong> Mezclar una porción con
                        240 ml de agua o tu bebida preferida. Se disuelve
                        fácilmente.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Cuándo tomarla:</strong> Se puede tomar en
                        cualquier momento del día, siendo común consumirla
                        después del entrenamiento o por la mañana los días de
                        descanso. La constancia diaria es más importante que el
                        momento exacto de la toma.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Fase de Carga (Opcional):</strong> Algunos
                        atletas optan por una fase de carga durante los primeros
                        5-7 días, consumiendo 20 gramos al día (divididos en 4
                        tomas de 5g), para saturar los músculos más rápidamente,
                        aunque no es un paso obligatorio.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 2 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    La Creatina 100% 300 G de Optimum Nutrition es un suplemento
                    popular de monohidrato de creatina micronizada pura,
                    diseñado para apoyar el aumento de fuerza, potencia y
                    rendimiento muscular durante ejercicios de alta intensidad.
                    Es un polvo sin sabor que se mezcla fácilmente.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Características y Beneficios Principales
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Monohidrato de Creatina Pura:</strong> Contiene
                        100% monohidrato de creatina de alta calidad, un
                        ingrediente ampliamente estudiado y de eficacia probada
                        en la nutrición deportiva.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Micronización para Mejor Absorción:</strong> El
                        polvo es micronizado, lo que significa que las
                        partículas son más finas, facilitando su disolución
                        rápida en líquidos y minimizando las molestias
                        gastrointestinales que a veces se asocian con la
                        creatina convencional.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Aumento del Rendimiento:</strong> Ayuda a
                        regenerar el ATP (trifosfato de adenosina), la principal
                        fuente de energía muscular para movimientos explosivos y
                        series de ejercicio intensas, permitiendo entrenamientos
                        más duros y duraderos.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Apoyo al Crecimiento Muscular:</strong> El uso
                        diario y constante, combinado con ejercicio de
                        resistencia, apoya el crecimiento de la masa muscular y
                        mejora el volumen celular.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Perfil Nutricional Limpio:</strong> Es libre de
                        azúcar, grasas y aditivos, aportando solo creatina pura,
                        lo que la hace compatible con dietas específicas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versatilidad:</strong> Al ser sin sabor, se
                        puede añadir a batidos de proteínas, jugos u otras
                        bebidas sin alterar su gusto.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Uso Sugerido
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis:</strong> Una porción típica es de 5
                        gramos (una cucharadita redondeada). El envase de 300 g
                        rinde aproximadamente 60 servicios.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Instrucciones:</strong> Mezclar la porción con
                        un vaso de agua, jugo o batido de proteínas y revolver
                        hasta que el polvo se disuelva completamente.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Momento de Consumo:</strong> La consistencia
                        diaria es clave. Se puede consumir antes o después del
                        entrenamiento, o en cualquier momento del día, incluso
                        en días de descanso, para mantener elevados los niveles
                        de creatina muscular.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Hidratación:</strong> Se recomienda beber al
                        menos ocho vasos de agua al día mientras se usa
                        creatina.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 3 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    La Creatina Monohidratada Micronizada de Nutrex Research
                    (presentación 300 g) es un suplemento de creatina
                    monohidrato ultra pura y de rápida absorción, diseñada para
                    aumentar la fuerza, la potencia y el rendimiento muscular.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Detalles y Beneficios del Producto
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Pureza y Calidad:</strong> Contiene 100%
                        monohidrato de creatina pura de alta calidad, un
                        ingrediente ampliamente estudiado y de eficacia probada.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Micronizada para Mejor Absorción:</strong> El
                        proceso de micronización reduce el tamaño de las
                        partículas del polvo, lo que mejora significativamente
                        su solubilidad y absorción en el organismo, optimizando
                        los resultados y reduciendo posibles molestias
                        gastrointestinales o hinchazón.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Aumento de Fuerza y Rendimiento:</strong> Ayuda
                        a regenerar el ATP, la fuente de energía del organismo
                        para los músculos, lo que permite realizar movimientos
                        explosivos y series de ejercicio más intensas y
                        duraderas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Promueve el Crecimiento Muscular:</strong>{" "}
                        Favorece la ganancia de masa muscular magra y acelera
                        los tiempos de recuperación muscular.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Perfil Nutricional Limpio:</strong> Es un polvo
                        sin sabor (unflavored), libre de azúcar y aditivos, lo
                        que facilita su mezcla con cualquier bebida sin alterar
                        su gusto.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versatilidad y Facilidad de Uso:</strong> Se
                        mezcla fácilmente con agua, jugos o batidos de proteínas
                        sin dejar una textura arenosa.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Uso Sugerido
                  </h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Para obtener mejores resultados, se recomienda un consumo
                    constante y diario:
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis:</strong> Una porción típica es de 5
                        gramos (equivalente a una cucharada). El envase de 300 g
                        rinde aproximadamente 60 servicios.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Instrucciones:</strong> Mezclar una cucharada
                        con aproximadamente 8 onzas (unos 240 ml) de agua fría u
                        otra bebida y consumir inmediatamente. Se disuelve
                        rápidamente con solo agitarla o removerla.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Momento de Consumo:</strong> Se puede tomar en
                        cualquier momento del día. La consistencia es más
                        importante que el momento exacto.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Hidratación:</strong> Consumir al menos 8 vasos
                        de agua al día mientras se usa creatina es recomendable.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 4 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    La Creatina Monohidratada 5G - 1000G de Nutrex Research es
                    un suplemento de creatina monohidrato ultra pura y
                    micronizada, diseñado para aumentar significativamente la
                    fuerza, la potencia y el rendimiento muscular. Cada envase
                    de 1 kg ofrece aproximadamente 200 servicios, con 5 gramos
                    de creatina por servicio.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Características y Beneficios Principales
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Pureza y Calidad:</strong> Contiene 100%
                        monohidrato de creatina pura de alta calidad. Es uno de
                        los suplementos más estudiados y efectivos para atletas
                        y entusiastas del fitness.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Micronización:</strong> El polvo es micronizado,
                        lo que reduce el tamaño de las partículas para una mejor
                        solubilidad y una absorción más rápida por parte del
                        organismo, minimizando la posibilidad de malestar
                        estomacal.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Aumento del Rendimiento Físico:</strong> Ayuda a
                        regenerar el ATP, la molécula de energía celular,
                        permitiendo entrenamientos más intensos, explosivos y
                        duraderos, y mejorando la resistencia.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Crecimiento Muscular Magro:</strong> El uso
                        constante, combinado con ejercicio de resistencia, apoya
                        la ganancia de masa muscular y acelera los tiempos de
                        recuperación.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versátil y Sin Sabor:</strong> Es un polvo sin
                        sabor, lo que facilita su mezcla con agua, jugos, o tus
                        batidos pre o post-entrenamiento favoritos sin alterar
                        su gusto.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Libre de Aditivos:</strong> No contiene
                        azúcares, carbohidratos ni grasas, lo que la hace
                        compatible con dietas específicas para definir o
                        aumentar masa muscular magra.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Uso Sugerido
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis:</strong> Una porción típica es de 5
                        gramos (equivalente a 1 scoop o cucharada).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Instrucciones:</strong> Mezclar 1 scoop en 8 a
                        12 onzas de agua (aproximadamente 240-350 ml) u otra
                        bebida y consumir inmediatamente.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Momento de Consumo:</strong> Se puede tomar
                        antes o después del entrenamiento. En días de descanso,
                        se puede tomar una porción por la mañana. La
                        consistencia diaria es clave para saturar los músculos y
                        obtener beneficios óptimos.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 5 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Aumenta tu fuerza, potencia y rendimiento muscular con
                    creatina micronizada de alta pureza. Más repeticiones, más
                    resultados. Rendimiento real desde el primer ciclo. La
                    CREATINA MONOHIDRATADA 300G de Scitec Nutrition es un
                    suplemento de creatina monohidrato 100% pura, reconocida por
                    mejorar el rendimiento deportivo, la fuerza y el crecimiento
                    muscular. Es un producto popular y bien valorado por los
                    atletas.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Beneficios Principales
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Aumento del rendimiento:</strong> La creatina ha
                        demostrado científicamente que mejora el rendimiento
                        físico en series sucesivas de ejercicios de alta
                        intensidad y corta duración, como el entrenamiento con
                        pesas y el cardio de intervalos.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Fuerza y potencia muscular:</strong> Promueve
                        una mayor fuerza y potencia muscular, permitiendo a los
                        atletas trabajar más duro durante las repeticiones o
                        carreras cortas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Recuperación y masa muscular:</strong>{" "}
                        Contribuye a preservar la masa muscular y puede ayudar a
                        reducir la fatiga.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Pureza y calidad:</strong> Este producto está
                        formulado con monohidrato de creatina 100% puro y es
                        apto para veganos.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Disolución rápida:</strong> Su presentación en
                        polvo micronizado facilita una rápida disolución y una
                        absorción eficiente.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Modo de Uso
                  </h2>
                  <p className="text-lg leading-relaxed mb-4">
                    La dosis recomendada es de 3,4 gramos (aproximadamente media
                    cucharada) al día, mezclados con 300 ml de agua u otra
                    bebida de tu elección.
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Días de entrenamiento:</strong> Consumir una
                        dosis 30 minutos antes del entrenamiento.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Días de descanso:</strong> Consumir una dosis
                        antes de una comida.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Hidratación:</strong> Es importante mantenerse
                        bien hidratado mientras se usa creatina.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis:</strong> No exceder la dosis diaria
                        recomendada.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 6 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    La forma más pura y estudiada de creatina. Aumenta tu
                    fuerza, potencia y ayuda a ganar masa muscular magra.
                    Esencial para cualquier deportista. La CREATINA
                    MONOHIDRATADA 120G de Ultimate Nutrition es un suplemento de
                    creatina monohidrato 100% pura y micronizada, diseñado para
                    potenciar el rendimiento físico en actividades de alta
                    intensidad.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Características Principales
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Pureza y Calidad:</strong> Contiene monohidrato
                        de creatina micronizada 100% pura, sin rellenos ni
                        aditivos innecesarios.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Formato y Porciones:</strong> El envase de 120g
                        ofrece aproximadamente 24 porciones de 5 gramos cada
                        una.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Alta Solubilidad:</strong> Gracias a su proceso
                        de micronización, se disuelve fácilmente en líquidos y
                        se absorbe de manera eficiente por el organismo.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versatilidad:</strong> Suele presentarse en una
                        fórmula sin sabor, lo que permite mezclarla con agua,
                        jugos o batidos de proteínas sin alterar su gusto.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Beneficios
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Incremento de la Fuerza y Potencia:</strong>{" "}
                        Ayuda a aumentar la fuerza y la potencia muscular
                        durante ejercicios de alta intensidad y corta duración.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Mejora del Rendimiento Deportivo:</strong>{" "}
                        Optimiza el rendimiento general en el entrenamiento,
                        permitiendo sesiones más intensas y duraderas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Apoyo al Crecimiento Muscular:</strong>{" "}
                        Contribuye al desarrollo de masa muscular magra cuando
                        se combina con un régimen de entrenamiento adecuado.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Recuperación Acelerada:</strong> Favorece una
                        recuperación muscular más rápida después del ejercicio.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Modo de Uso
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis:</strong> La porción recomendada es de 5
                        gramos al día.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Preparación:</strong> Mezclar una porción (5g)
                        en al menos 500 ml de agua o tu bebida favorita.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Constancia:</strong> Para obtener mejores
                        resultados, se debe tomar diariamente, tanto en días de
                        entrenamiento como de descanso, para saturar las
                        reservas musculares de creatina.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Hidratación:</strong> Es fundamental mantener
                        una ingesta de agua adecuada a lo largo del día mientras
                        se consume este suplemento.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 7 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Maximiza tu fuerza y rendimiento con nuestra creatina
                    monohidratada de alta pureza. Cada porción de 3g te aporta
                    la energía explosiva necesaria para entrenamientos intensos,
                    mejorando tu capacidad de esfuerzo y recuperación muscular.
                    Ideal para mezclar con tus bebidas favoritas, sin sabor,
                    apta para veganos y libre de gluten y lactosa. La CREATINA
                    MONOHIDRATADA DYMATIZE 300G es un suplemento de creatina
                    monohidrato micronizada, conocida por su alta calidad y
                    pureza. Es una opción popular entre los atletas que buscan
                    mejorar su rendimiento deportivo, fuerza y masa muscular.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Beneficios Clave
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Rendimiento y Fuerza:</strong> Ayuda a aumentar
                        la fuerza muscular y la potencia, lo que permite un
                        mejor desempeño durante ejercicios de alta intensidad y
                        corta duración.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Pureza Certificada:</strong> Muchas
                        presentaciones de Dymatize Creatine Monohydrate utilizan
                        Creapure®, una marca de creatina monohidrato reconocida
                        mundialmente por su máxima pureza, fabricada en
                        Alemania. Además, cuenta con la certificación Informed
                        Choice, que garantiza que se ha analizado para detectar
                        más de 285 sustancias prohibidas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Mejor Absorción:</strong> Su fórmula micronizada
                        asegura una excelente solubilidad y una mejor absorción
                        por parte del organismo, sin dejar grumos.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versatilidad:</strong> Es sin sabor y sin
                        gluten, ideal para mezclar fácilmente con agua, jugos o
                        batidos de proteínas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Recuperación Muscular:</strong> Contribuye a una
                        mejor y más rápida recuperación muscular después del
                        ejercicio.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Modo de Uso
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis:</strong> El envase de 300g contiene
                        aproximadamente 60 porciones de 3 a 3.4 gramos cada una,
                        dependiendo de la presentación específica.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Preparación:</strong> Mezclar una porción
                        (usualmente dos cucharadas) con agua fría o tu bebida
                        preferida.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Momento de Consumo:</strong> Se puede consumir
                        antes o después del entrenamiento, o en ayunas. Muchos
                        estudios coinciden en que tomarla después de entrenar es
                        muy efectivo.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Hidratación:</strong> Es fundamental mantenerse
                        bien hidratado mientras se usa este producto.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : creatina.id === 8 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Descripción del Producto
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Mejora la fuerza, potencia y rendimiento muscular durante
                    entrenamientos de moderada y alta intensidad. Su
                    presentación micronizada facilita la disolución y absorción,
                    optimizando los resultados sin aportar calorías. La CREATINA
                    600G de Optimum Nutrition es un suplemento de creatina
                    monohidrato 100% pura y micronizada diseñada para aumentar
                    la fuerza, la potencia y el rendimiento muscular.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Información Nutricional
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Ingrediente principal:</strong> Monohidrato de
                        creatina 100% puro
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Tamaño de la porción:</strong> 5 g
                        (aproximadamente una cucharadita redondeada)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Cantidad por porción:</strong> 5 g de
                        monohidrato de creatina
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Calorías:</strong> 0 kcal
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Carbohidratos:</strong> 0 g
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Sabor:</strong> Sin sabor (unflavoured)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Porciones por envase:</strong> Aproximadamente
                        120 porciones
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Beneficios Principales
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Aumento del rendimiento y la fuerza:</strong>{" "}
                        Ayuda a mejorar significativamente el rendimiento físico
                        durante ejercicios repetidos de alta intensidad y corta
                        duración.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Recuperación muscular:</strong> Apoya la
                        recuperación muscular y el crecimiento de la masa
                        muscular magra cuando se combina con entrenamiento de
                        resistencia regular.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Pureza y calidad:</strong> Es un producto
                        reconocido por su alta calidad y pureza, a menudo
                        sometido a pruebas de sustancias prohibidas (Informed
                        Choice certified).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Fácil de mezclar:</strong> Su proceso de
                        micronización (partículas más pequeñas) permite que se
                        disuelva fácilmente en líquidos y permanezca suspendida
                        por más tiempo, evitando la textura arenosa.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    Modo de Uso
                  </h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Dosis recomendada:</strong> Mezclar una
                        cucharada (5 g) con 240-300 ml de agua, jugo o tu batido
                        de proteínas favorito.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Consistencia:</strong> Se recomienda el consumo
                        diario, tanto en días de entrenamiento como de descanso,
                        para mantener saturadas las reservas de creatina en los
                        músculos.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Hidratación:</strong> Mantener una ingesta de
                        agua adecuada a lo largo del día es crucial al consumir
                        creatina.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>
                        <strong>Versatilidad:</strong> Al ser sin sabor, se
                        puede añadir a casi cualquier bebida sin alterar el
                        gusto.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">
                  Descripción
                </h2>
                <p className="text-lg leading-relaxed">
                  {creatina.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
