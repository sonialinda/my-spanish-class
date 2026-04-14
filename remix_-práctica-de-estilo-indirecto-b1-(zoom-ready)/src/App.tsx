/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  UserCircle, 
  Newspaper, 
  History, 
  Lightbulb, 
  ChevronRight, 
  Eye, 
  EyeOff,
  BookOpen,
  CheckCircle2,
  Monitor,
  List,
  ChevronLeft,
  StickyNote,
  X
} from 'lucide-react';

interface ExerciseItem {
  direct: string;
  indirect: string;
  context?: string;
}

interface Exercise {
  id: string;
  title: string;
  objective: string;
  role: string;
  icon: any;
  items: ExerciseItem[];
}

const EXERCISES: Exercise[] = [
  {
    id: 'secretario',
    title: 'El Secretario/a',
    objective: 'Practicar el paso de Imperativo a Subjuntivo.',
    role: 'Tú actúas como el jefe dando órdenes y el alumno se las transmite a un compañero imaginario.',
    icon: UserCircle,
    items: [
      { direct: '¡Llama al cliente ahora mismo!', indirect: 'Dice que llames al cliente ahora mismo.' },
      { direct: 'No envíes el informe hasta mañana.', indirect: 'Dice que no envíes el informe hasta mañana.' },
      { direct: 'Dile a Recursos Humanos que necesito el contrato.', indirect: 'Dice que le digas a RRHH que necesita el contrato.' },
      { direct: 'Ven a mi oficina después de comer.', indirect: 'Me ha dicho que vaya a su oficina después de comer.' },
      { direct: 'Por favor, reserva una mesa para tres personas.', indirect: 'Pide que reserves una mesa para tres.' },
      { direct: 'No pongas música tan alta en la oficina.', indirect: 'Me pide que no ponga la música tan alta.' },
    ]
  },
  {
    id: 'periodista',
    title: 'El Periodista de Cotilleos',
    objective: 'Practicar el paso de Presente a Imperfecto y Futuro a Condicional.',
    role: 'Tú actúas como una celebridad caprichosa y el alumno resume tus declaraciones.',
    icon: Newspaper,
    items: [
      { direct: 'Estoy muy cansado de la fama.', indirect: 'Confesó que estaba muy cansado de la fama.' },
      { direct: 'Mañana me compraré un coche de lujo.', indirect: 'Dijo que al día siguiente se compraría un coche.' },
      { direct: 'No conozco a esa persona de la foto.', indirect: 'Aseguró que no conocía a esa persona.' },
      { direct: 'Odio que la gente me pida autógrafos.', indirect: 'Explicó que odiaba que la gente le pidiera...' },
      { direct: 'Pienso mudarme a las Bahamas pronto.', indirect: 'Dijo que pensaba mudarse a las Bahamas pronto.' },
      { direct: 'Mi gato es el único que me entiende.', indirect: 'Afirmó que su gato era el único que lo entendía.' },
    ]
  },
  {
    id: 'pasados',
    title: 'La conversación de ayer',
    objective: 'Practicar el paso de Pretérito Indefinido/Perfecto a Pluscuamperfecto.',
    role: 'Tú le preguntas qué le dijeron ayer y él tiene que usar el pasado del pasado.',
    icon: History,
    items: [
      { direct: '¿Qué te dijo tu madre ayer?', indirect: 'Dijo que había ido al médico. (Directo: He ido).' },
      { direct: '¿Qué te contó tu amigo de su viaje?', indirect: 'Me contó que se lo había pasado genial. (Directo: Lo pasé).' },
      { direct: '¿Qué te dijo el camarero?', indirect: 'Dijo que se habían terminado las croquetas. (Directo: Se han terminado).' },
      { direct: '¿Por qué llegaste tarde a la cita?', indirect: 'Porque el taxista me dijo que había habido un accidente.' },
    ]
  }
];

const TIPS = [
  {
    title: 'El reto de los pronombres',
    content: 'Fíjate si el alumno cambia bien los pronombres. Si tú dices "Llámame", él debe decir "Que le llames". Es un error muy común en B1.',
    icon: UserCircle
  },
  {
    title: 'Marcadores temporales',
    content: 'Si en la frase aparece "mañana", "ayer" o "ahora", oblígale a cambiarlos por "al día siguiente", "el día anterior" o "en ese momento".',
    icon: History
  }
];

const REPORTING_VERBS = [
  'Gritó que...', 'Preguntó si...', 'Se quejó de que...', 'Prometió que...', 'Aseguró que...', 'Explicó que...', 'Confesó que...'
];

const GRAMMAR_RULES = [
  {
    direct: 'Presente',
    indirect: 'Pretérito Imperfecto',
    example: '"Tengo hambre" ➔ Dijo que tenía hambre.',
    color: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  {
    direct: 'Indefinido / Perfecto',
    indirect: 'Pluscuamperfecto',
    example: '"Fui al cine" ➔ Dijo que había ido al cine.',
    color: 'bg-purple-50 text-purple-700 border-purple-100'
  },
  {
    direct: 'Futuro',
    indirect: 'Condicional',
    example: '"Iré mañana" ➔ Dijo que iría al día siguiente.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  },
  {
    direct: 'Imperativo',
    indirect: 'Subjuntivo',
    example: '"¡Ven aquí!" ➔ Me dijo que fuera allí.',
    color: 'bg-rose-50 text-rose-700 border-rose-100'
  }
];

const TEMPORAL_MARKERS = [
  { direct: 'Hoy', indirect: 'Ese día' },
  { direct: 'Mañana', indirect: 'Al día siguiente' },
  { direct: 'Ayer', indirect: 'El día anterior' },
  { direct: 'Ahora', indirect: 'En ese momento' },
  { direct: 'Aquí', indirect: 'Allí / Ahí' },
  { direct: 'Este/a', indirect: 'Aquel / Aquella' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('gramatica');
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'presentation'>('list');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState(false);

  const toggleReveal = (id: string) => {
    setRevealedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeExercise = EXERCISES.find(e => e.id === activeTab);

  const handleNext = () => {
    if (activeExercise && currentIndex < activeExercise.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const resetReveals = () => {
    setRevealedItems({});
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <MessageSquare className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Estilo Indirecto</h1>
              <p className="text-slate-500 text-sm font-medium">Nivel B1 · Práctica Gramatical</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List className="w-3.5 h-3.5" />
                Lista
              </button>
              <button 
                onClick={() => setViewMode('presentation')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'presentation' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Presentación
              </button>
            </div>
            <button 
              onClick={resetReveals}
              className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Reiniciar
            </button>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700 text-xs font-bold uppercase tracking-wider">Zoom Ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-6">
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Inicio</h2>
              <button
                onClick={() => setActiveTab('gramatica')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mb-6 ${
                  activeTab === 'gramatica' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                }`}
              >
                <BookOpen className={`w-5 h-5 ${activeTab === 'gramatica' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                <span className="font-semibold text-sm">Gramática: Cambios</span>
                <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${activeTab === 'gramatica' ? 'rotate-90' : ''}`} />
              </button>

              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Ejercicios</h2>
              <nav className="space-y-1">
                {EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveTab(ex.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      activeTab === ex.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                    }`}
                  >
                    <ex.icon className={`w-5 h-5 ${activeTab === ex.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    <span className="font-semibold text-sm">{ex.title}</span>
                    <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${activeTab === ex.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </nav>
            </section>

            <section className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h2 className="font-display font-bold text-amber-900">Tips para tu clase</h2>
              </div>
              <div className="space-y-4">
                {TIPS.map((tip, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="text-sm font-bold text-amber-800">{tip.title}</h3>
                    <p className="text-xs text-amber-700 leading-relaxed">{tip.content}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-indigo-900 rounded-2xl p-5 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-300" />
                <h2 className="font-display font-bold">Verbos de Reporte</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {REPORTING_VERBS.map((verb, idx) => (
                  <span key={idx} className="bg-indigo-800/50 text-indigo-100 px-2 py-1 rounded-md text-[10px] font-mono border border-indigo-700/50">
                    {verb}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'gramatica' && (
                <motion.div
                  key="gramatica"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                      <BookOpen className="w-3.5 h-3.5" />
                      Introducción Teórica
                    </div>
                    <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">¿Cómo cambia el tiempo?</h2>
                    <p className="text-slate-600 leading-relaxed mb-8">
                      Cuando pasamos del estilo directo al indirecto, los tiempos verbales suelen "dar un paso atrás" en el pasado. Aquí tienes la guía rápida para el nivel B1:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {GRAMMAR_RULES.map((rule, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border ${rule.color}`}>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Directo</span>
                            <ChevronRight className="w-4 h-4 opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Indirecto</span>
                          </div>
                          <div className="flex justify-between items-baseline mb-4">
                            <span className="font-bold text-lg">{rule.direct}</span>
                            <span className="font-bold text-lg">{rule.indirect}</span>
                          </div>
                          <p className="text-xs font-medium italic opacity-80 bg-white/40 p-2 rounded-lg">
                            {rule.example}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12">
                      <h3 className="font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-500" />
                        Cambios en Marcadores Temporales
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {TEMPORAL_MARKERS.map((marker, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col items-center text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{marker.direct}</span>
                            <ChevronRight className="w-3 h-3 text-slate-300 rotate-90 my-0.5" />
                            <span className="text-sm font-bold text-indigo-600">{marker.indirect}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-12 p-8 bg-indigo-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <History className="w-32 h-32" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                          <Lightbulb className="w-6 h-6 text-amber-400" />
                          La importancia del verbo introductor
                        </h3>
                        <p className="text-indigo-100 leading-relaxed mb-6">
                          Los cambios de tiempo y marcadores solo ocurren si el verbo que introduce la frase está en <strong>pasado</strong> (Indefinido, Imperfecto o Pluscuamperfecto).
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 block mb-2">Si es PRESENTE (No cambia)</span>
                            <p className="text-sm font-medium mb-1">Directo: "Tengo sueño"</p>
                            <p className="text-sm font-bold text-emerald-400">➔ Dice que tiene sueño.</p>
                            <p className="text-[10px] mt-2 text-indigo-200 italic">El tiempo se mantiene igual.</p>
                          </div>
                          <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 block mb-2">Si es PASADO (¡Cambia!)</span>
                            <p className="text-sm font-medium mb-1">Directo: "Tengo sueño"</p>
                            <p className="text-sm font-bold text-amber-400">➔ Dijo que tenía sueño.</p>
                            <p className="text-[10px] mt-2 text-indigo-200 italic">El presente pasa a imperfecto.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('secretario')}
                      className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      Empezar Ejercicios
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeExercise && viewMode === 'list' && activeTab !== 'gramatica' && (
                <motion.div
                  key={`list-${activeExercise.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Exercise Info */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <activeExercise.icon className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                        <activeExercise.icon className="w-3.5 h-3.5" />
                        {activeExercise.title}
                      </div>
                      <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">{activeExercise.title}</h2>
                      <p className="text-indigo-600 font-semibold mb-4">{activeExercise.objective}</p>
                      <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500 italic text-slate-600 text-sm">
                        "{activeExercise.role}"
                      </div>
                    </div>
                  </div>

                  {/* Exercise Items */}
                  <div className="space-y-4">
                    {activeExercise.items.map((item, idx) => {
                      const itemId = `${activeExercise.id}-${idx}`;
                      const isRevealed = revealedItems[itemId];

                      return (
                        <div 
                          key={idx}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Estilo Directo</span>
                              <p className="text-lg font-medium text-slate-800">"{item.direct}"</p>
                            </div>
                            <button
                              onClick={() => toggleReveal(itemId)}
                              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                isRevealed 
                                  ? 'bg-slate-100 text-slate-600' 
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                              }`}
                            >
                              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              {isRevealed ? 'Ocultar' : 'Revelar'}
                            </button>
                          </div>
                          
                          <AnimatePresence>
                            {isRevealed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-indigo-50 border-t border-indigo-100"
                              >
                                <div className="p-5">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Estilo Indirecto</span>
                                  <p className="text-indigo-900 font-bold text-lg leading-relaxed">
                                    {item.indirect.split('**').map((part, i) => 
                                      i % 2 === 1 ? <span key={i} className="text-indigo-600 underline decoration-indigo-300 underline-offset-4">{part}</span> : part
                                    )}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeExercise && viewMode === 'presentation' && (
                <motion.div
                  key={`pres-${activeExercise.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2rem] p-12 border-2 border-indigo-100 shadow-2xl shadow-indigo-100/50 min-h-[500px] flex flex-col justify-center relative">
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
                      <span className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em]">Página {currentIndex + 1} de {activeExercise.items.length}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowNotes(!showNotes)}
                          className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                        >
                          <StickyNote className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-12 text-center">
                      <div className="space-y-4">
                        <span className="inline-block px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">Estilo Directo</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                          "{activeExercise.items[currentIndex].direct}"
                        </h2>
                      </div>

                      <div className="min-h-[120px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {revealedItems[`${activeExercise.id}-${currentIndex}`] ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">Estilo Indirecto</span>
                              <p className="text-3xl md:text-4xl font-display font-bold text-indigo-600 leading-tight">
                                {activeExercise.items[currentIndex].indirect.split('**').map((part, i) => 
                                  i % 2 === 1 ? <span key={i} className="underline decoration-indigo-200 underline-offset-8">{part}</span> : part
                                )}
                              </p>
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => toggleReveal(`${activeExercise.id}-${currentIndex}`)}
                              className="group flex flex-col items-center gap-4"
                            >
                              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                                <Eye className="w-8 h-8" />
                              </div>
                              <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Revelar Respuesta</span>
                            </button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                      <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-0 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Anterior
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentIndex === activeExercise.items.length - 1}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-0 transition-all"
                      >
                        Siguiente
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Floating Notes */}
                    <AnimatePresence>
                      {showNotes && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="absolute -right-4 top-20 w-64 bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-xl p-4 z-20"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Notas de Clase</span>
                            <button onClick={() => setShowNotes(false)}><X className="w-4 h-4 text-amber-400" /></button>
                          </div>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Escribe correcciones aquí..."
                            className="w-full h-40 bg-transparent border-none focus:ring-0 text-sm text-amber-900 placeholder:text-amber-300 resize-none font-medium"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-slate-900">Práctica de Estilo Indirecto</h3>
            <p className="text-slate-500 text-sm">Diseñado para clases de español nivel B1</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-slate-400">+12 profesores lo usan hoy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

