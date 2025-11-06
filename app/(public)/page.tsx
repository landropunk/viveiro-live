"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";
import type { BlogPost } from "@/lib/admin/blog";
import { createClient } from "@/lib/supabase/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [blogEnabled, setBlogEnabled] = useState(true);
  const [sectionsConfig, setSectionsConfig] = useState({
    meteo: true,
    historicos: true,
    webcams: true,
    eventos: true,
  });

  useEffect(() => {
    const loadPublicConfig = async () => {
      try {
        const supabase = createClient();

        // Cargar configuración de secciones del dashboard
        const { data: settings } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', [
            'dashboard_section_meteo',
            'dashboard_section_historicos',
            'dashboard_section_webcams',
            'dashboard_section_eventos',
            'feature_blog'
          ]);

        if (settings) {
          const config = {
            meteo: true,
            historicos: true,
            webcams: true,
            eventos: true,
          };

          settings.forEach((setting) => {
            if (setting.key === 'dashboard_section_meteo') {
              config.meteo = setting.value?.enabled === true;
            } else if (setting.key === 'dashboard_section_historicos') {
              config.historicos = setting.value?.enabled === true;
            } else if (setting.key === 'dashboard_section_webcams') {
              config.webcams = setting.value?.enabled === true;
            } else if (setting.key === 'dashboard_section_eventos') {
              config.eventos = setting.value?.enabled === true;
            } else if (setting.key === 'feature_blog') {
              setBlogEnabled(setting.value?.enabled === true);
            }
          });

          setSectionsConfig(config);
        }
      } catch (error) {
        console.error('Error loading public config:', error);
      }
    };

    const loadBlogPosts = async () => {
      try {
        const supabase = createClient();
        const { data: posts, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error loading blog posts:', error);
          return;
        }

        setBlogPosts(posts || []);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadPublicConfig();
    loadBlogPosts();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {user && <Header showLogo={false} />}
      <main className={`flex min-h-screen flex-col items-center bg-gray-50 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 ${user ? 'pt-24 pb-12' : 'justify-center py-12'}`}>
        {/* Hero Section */}
        <div className="z-10 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center"
          >
            {/* Logo y título juntos */}
            <div className="mb-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
              {/* Logo sin animaciones para evitar conflictos */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  position: "relative",
                  flexShrink: 0
                }}
              >
                {/* Bandera como fondo circular */}
                <img
                  src="/banderaViveiro.jpg"
                  alt="Bandera de Viveiro"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
                {/* Escudo encima centrado */}
                <img
                  src="/Escudo_de_Viveiro.png"
                  alt="Escudo de Viveiro"
                  style={{
                    width: "auto",
                    height: "100px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "block",
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
                  }}
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl"
              >
                viveiro.live
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mb-3 max-w-3xl text-2xl font-semibold text-gray-900 dark:text-white"
            >
              Tu Portal de Viveiro
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
            >
              Meteorología en tiempo real, contenido en directo, webcams y más servicios
              de Viveiro (Lugo, España).
            </motion.p>
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center gap-4"
              >
                <Link
                  href="/auth/login"
                  className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all hover:scale-105 hover:bg-gray-50 hover:shadow-xl dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
                >
                  Registrarse
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Sections Preview */}
          <AnimatedSection className="mt-20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {/* Meteorología */}
              {sectionsConfig.meteo && (
              <Link href={user ? "/dashboard/meteo" : "/auth/login"}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
                >
                  <motion.div
                    className="mb-4 text-5xl"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ☁️
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Meteorología
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Datos meteorológicos en tiempo real de las estaciones de Viveiro, con históricos
                    de hasta 72 horas y pronósticos detallados.
                  </p>
                </motion.div>
              </Link>
              )}

              {/* Live/Play */}
              {sectionsConfig.eventos && (
              <Link href={user ? "/dashboard/eventos" : "/auth/login"}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
                >
                  <motion.div
                    className="mb-4 text-5xl"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    📺
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Live / Play
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contenido en directo y grabaciones de eventos, actividades y momentos
                    destacados de Viveiro.
                  </p>
                </motion.div>
              </Link>
              )}

              {/* Webcams */}
              {sectionsConfig.webcams && (
              <Link href={user ? "/dashboard/webcams" : "/auth/login"}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
                >
                  <motion.div
                    className="mb-4 text-5xl"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    📷
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Webcams
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualización en directo de cámaras en diferentes ubicaciones de Viveiro
                    con vista en cuadrícula y pantalla completa.
                  </p>
                </motion.div>
              </Link>
              )}

              {/* Históricos Horarios */}
              {sectionsConfig.historicos && (
              <Link href={user ? "/dashboard/historicos" : "/auth/login"}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-orange-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
                >
                  <motion.div
                    className="mb-4 text-5xl"
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    📊
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Históricos Horarios
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Consulta datos históricos de las últimas horas con gráficos interactivos
                    de temperatura, humedad, viento y precipitación.
                  </p>
                </motion.div>
              </Link>
              )}

            </motion.div>
          </AnimatedSection>

          {/* Blog / Noticias */}
          {blogEnabled && !loadingPosts && blogPosts.length > 0 && (
            <AnimatedSection className="mt-20">
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Blog
                </h2>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex w-full flex-col gap-6"
              >
                {blogPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <motion.article
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, y: -2 }}
                      transition={{ duration: 0.3 }}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 md:flex-row"
                    >
                      {post.cover_image_url && (
                        <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900 md:h-auto md:w-80">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {post.category}
                            </span>
                            <span>•</span>
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                          <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mb-4 text-gray-600 dark:text-gray-400">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                          Leer más
                          <span className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </motion.div>
            </AnimatedSection>
          )}

          {/* CTA Footer */}
          <AnimatedSection className="mt-20" direction="up">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-12 text-center dark:border-gray-800 dark:from-blue-900/20 dark:to-cyan-900/20"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4 text-3xl font-bold text-gray-900 dark:text-white"
              >
                ¿Listo para comenzar?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
              >
                Regístrate ahora y accede a todas las secciones de viveiro.live.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  href="/auth/register"
                  className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-110 hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl"
                >
                  Crear cuenta gratis
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Features */}
          <div className="mt-16 border-t border-gray-200 pt-12 dark:border-gray-800">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid gap-4 md:grid-cols-3"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-950/50"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Datos en Tiempo Real</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Información actualizada de MeteoGalicia y otras fuentes oficiales.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-950/50"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Diseño Responsive</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Accede desde cualquier dispositivo: móvil, tablet o escritorio.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white/50 p-4 dark:border-gray-800 dark:bg-gray-950/50"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Acceso Seguro</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sistema de autenticación OAuth con Google, Microsoft y Facebook.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
