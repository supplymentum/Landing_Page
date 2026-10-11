"use client";

import { useEffect, useState, FormEvent } from "react";
import { Loader2, Save, AlertCircle } from "lucide-react";

import PageHeader from "@/components/cms/PageHeader";
import {
  type ConvocatoriaSettings,
  getConvocatoriaSettings,
  updateConvocatoriaSettings,
} from "@/lib/api/settings";

export default function ConvocatoriaSettingsPage() {
  const [settings, setSettings] = useState<ConvocatoriaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getConvocatoriaSettings();
        setSettings(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron obtener las configuraciones."
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const updated = await updateConvocatoriaSettings(settings);
      setSettings(updated);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar la configuración."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof ConvocatoriaSettings>(
    field: K,
    value: ConvocatoriaSettings[K]
  ) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={30} className="animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-red-500">
        <AlertCircle className="mr-2" /> Error al cargar configuraciones.
      </div>
    );
  }

  // Format deadline for local datetime-local input
  const localDeadline = new Date(settings.deadline);
  // Get components in local time and format as YYYY-MM-DDThh:mm
  const localDeadlineStr = new Date(localDeadline.getTime() - (localDeadline.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Convocatoria"
        description="Administra la fecha límite y los textos de la campaña actual."
      />

      {error && (
        <div className="mb-5 border border-red-900/50 bg-red-950/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-5 border border-emerald-900/50 bg-emerald-950/20 px-4 py-3">
          <p className="text-sm text-emerald-400">Configuración guardada exitosamente.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="border border-[#22222A] bg-[#111115]">
          <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
            <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Estado y Tiempos
            </p>
            <h2 className="mt-1 text-base font-semibold text-zinc-200">
              Plazos de la Convocatoria
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                type="checkbox"
                checked={settings.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                disabled={submitting}
                className="mt-1 h-4 w-4 accent-[#ED1C24]"
              />
              <div>
                <p className="text-sm font-semibold text-zinc-300">
                  Convocatoria Activa
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Si se desactiva, los usuarios no podrán postular ni ver el contador de tiempo.
                </p>
              </div>
            </label>

            <div>
              <label className="cms-label block mb-2">Fecha límite de postulación</label>
              <input
                type="datetime-local"
                value={localDeadlineStr}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  updateField("deadline", date.toISOString());
                }}
                disabled={submitting}
                className="cms-input"
              />
            </div>
          </div>
        </section>

        <section className="border border-[#22222A] bg-[#111115]">
          <div className="border-b border-[#22222A] px-5 py-4 sm:px-6">
            <p className="font-[family-name:var(--font-archivo)] text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Contenido Visual
            </p>
            <h2 className="mt-1 text-base font-semibold text-zinc-200">
              Textos de la Landing
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">
            <div>
              <label className="cms-label block mb-2">Título Principal</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => updateField("title", e.target.value)}
                disabled={submitting}
                className="cms-input"
              />
            </div>

            <div>
              <label className="cms-label block mb-2">Descripción / Subtítulo</label>
              <textarea
                value={settings.description}
                onChange={(e) => updateField("description", e.target.value)}
                disabled={submitting}
                rows={3}
                className="cms-input resize-y py-3"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="cms-button-primary"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Guardando...</>
            ) : (
              <><Save size={16} className="mr-2" /> Guardar cambios</>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
