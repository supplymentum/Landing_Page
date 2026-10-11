"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Loader2,
    LogOut,
    Send,
    X,
    XCircle,
} from "lucide-react";

import {
    type ApplicationArea,
    type ApplicationPayload,
    type MyApplicationResponse,
    getApplicationAreas,
    getMyApplication,
    sendApplication,
} from "@/lib/api/applications";
import { useGoogleAuth } from "@/lib/useGoogleAuth";
import ModalPortal from "@/components/ui/ModalPortal";

interface ApplicationModalProps {
    open: boolean;
    onClose: () => void;
    /** Área preseleccionada al abrir desde una tarjeta de área */
    preselectedArea?: string | null;
}

interface FormState {
    first_name: string;
    last_name: string;
    phone: string;
    career: string;
    codigo_uni: string;
    university_semester: string;
    application_reason: string;
    first_choice_area_id: string;
    second_choice_area_id: string;
}

const INITIAL_FORM: FormState = {
    first_name: "",
    last_name: "",
    phone: "",
    career: "",
    codigo_uni: "",
    university_semester: "",
    application_reason: "",
    first_choice_area_id: "",
    second_choice_area_id: "",
};

export default function ApplicationModal({
    open,
    onClose,
    preselectedArea,
}: ApplicationModalProps) {
    const { user, loading: authLoading, configured, signIn, signOut } =
        useGoogleAuth();

    const [areas, setAreas] = useState<ApplicationArea[]>([]);
    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    const [myApplication, setMyApplication] =
        useState<MyApplicationResponse | null>(null);
    const [checkingApplication, setCheckingApplication] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    /* Áreas disponibles: se cargan la primera vez que se abre el modal */
    useEffect(() => {
        if (!open || areas.length > 0) {
            return;
        }

        let cancelado = false;

        getApplicationAreas()
            .then((data) => {
                if (!cancelado) setAreas(data);
            })
            .catch(() => {
                if (!cancelado) {
                    setError(
                        "No se pudieron cargar las áreas. Cierra el formulario e intenta de nuevo.",
                    );
                }
            });

        return () => {
            cancelado = true;
        };
    }, [open, areas.length]);

    /* Al iniciar sesión revisamos si esa cuenta ya postuló */
    useEffect(() => {
        if (!open || !user) {
            setMyApplication(null);
            return;
        }

        let cancelado = false;
        setCheckingApplication(true);

        getMyApplication()
            .then((data) => {
                if (!cancelado) setMyApplication(data);
            })
            .catch(() => {
                /* Si falla la verificación dejamos que intente enviar:
                   el backend rechaza el duplicado de todas formas. */
            })
            .finally(() => {
                if (!cancelado) setCheckingApplication(false);
            });

        return () => {
            cancelado = true;
        };
    }, [open, user]);

    /* Precargamos nombre y apellido desde la cuenta de Google */
    useEffect(() => {
        if (!user) {
            return;
        }

        const fullName =
            (user.user_metadata?.full_name as string | undefined) ?? "";

        if (!fullName) {
            return;
        }

        const [firstName, ...rest] = fullName.split(" ");

        setForm((current) => ({
            ...current,
            first_name: current.first_name || firstName,
            last_name: current.last_name || rest.join(" "),
        }));
    }, [user]);

    /* Área preseleccionada desde la grilla de áreas */
    useEffect(() => {
        if (!open || !preselectedArea || areas.length === 0) {
            return;
        }

        const match = areas.find((area) => area.name === preselectedArea);

        if (match) {
            setForm((current) => ({
                ...current,
                first_choice_area_id: String(match.area_id),
            }));
        }
    }, [open, preselectedArea, areas]);

    const handleClose = useCallback(() => {
        setError(null);
        setSuccess(false);
        onClose();
    }, [onClose]);

    /* Cerrar con Escape y bloquear el scroll del fondo */
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, handleClose]);

    if (!open) {
        return null;
    }

    function updateField<K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function validateForm(): string | null {
        const required: [keyof FormState, string][] = [
            ["first_name", "nombres"],
            ["last_name", "apellidos"],
            ["phone", "teléfono"],
            ["codigo_uni", "código UNI"],
            ["career", "carrera"],
            ["university_semester", "ciclo"],
            ["application_reason", "motivo de postulación"],
        ];

        for (const [field, label] of required) {
            if (!form[field].trim()) {
                return `El campo ${label} es obligatorio.`;
            }
        }

        if (!form.first_choice_area_id) {
            return "Debes elegir un área de primera opción.";
        }

        if (
            form.second_choice_area_id &&
            form.second_choice_area_id === form.first_choice_area_id
        ) {
            return "La segunda opción debe ser un área distinta a la primera.";
        }

        return null;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        const payload: ApplicationPayload = {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            phone: form.phone.trim(),
            career: form.career.trim(),
            codigo_uni: form.codigo_uni.trim(),
            university_semester: form.university_semester.trim(),
            application_reason: form.application_reason.trim(),
            first_choice_area_id: Number(form.first_choice_area_id),
        };

        if (form.second_choice_area_id) {
            payload.second_choice_area_id = Number(form.second_choice_area_id);
        }

        try {
            setSubmitting(true);
            setError(null);

            await sendApplication(payload);

            setSuccess(true);
            setForm(INITIAL_FORM);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo enviar tu postulación. Intenta de nuevo.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    const inputClass =
        "w-full px-4 py-3 bg-[#0A0A0C] border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ED1C24]/60 focus:ring-1 focus:ring-[#ED1C24]/30 transition-colors duration-200 disabled:opacity-50";

    const labelClass =
        "block mb-2 text-[10px] font-bold tracking-widest uppercase text-zinc-400";

    const alreadyApplied = Boolean(myApplication?.has_applied) && !success;

    /* Qué mostramos dentro del modal según el estado de la sesión */
    const showLoginGate = !authLoading && !user;
    const showForm = Boolean(user) && !alreadyApplied && !success;

    return (
        <ModalPortal>
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
            role="presentation"
        >
            <div
                className="relative w-full max-w-2xl bg-[#121216] border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-modal-title"
            >
                {/* Cabecera */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#0A0A0C]">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#ED1C24]" />

                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#ED1C24] uppercase">
                                CONVOCATORIA 2026-II
                            </span>

                            <h3
                                id="application-modal-title"
                                className="text-xl font-black text-white"
                            >
                                Postula a SupplyMentum
                            </h3>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Cerrar formulario"
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Barra de sesión */}
                {user && (
                    <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-zinc-800/60 bg-[#0D0D10]">
                        <p className="text-xs text-zinc-500 truncate">
                            Postulando como{" "}
                            <span className="text-zinc-300 font-semibold">
                                {user.email}
                            </span>
                        </p>

                        <button
                            type="button"
                            onClick={() => void signOut()}
                            className="inline-flex items-center gap-1.5 shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                        >
                            <LogOut size={13} />
                            Cambiar cuenta
                        </button>
                    </div>
                )}

                {/* Cuerpo desplazable */}
                <div className="p-6 overflow-y-auto flex-1">
                    {!configured ? (
                        <StateMessage
                            icon={
                                <AlertCircle className="w-12 h-12 text-amber-500" />
                            }
                            title="Login no configurado"
                            description="Falta configurar las credenciales de Supabase Auth en este entorno para poder postular con Google."
                        />
                    ) : authLoading || checkingApplication ? (
                        <div className="flex items-center justify-center gap-2 py-16 text-zinc-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Verificando sesión…</span>
                        </div>
                    ) : showLoginGate ? (
                        <div className="flex flex-col items-center text-center gap-5 py-12">
                            <h4 className="text-xl font-bold text-white">
                                Inicia sesión para postular
                            </h4>

                            <p className="text-sm text-zinc-400 max-w-md">
                                Usamos tu cuenta de Google para identificarte y
                                asegurar que cada persona envíe una sola
                                postulación.
                            </p>

                            <button
                                type="button"
                                onClick={() => void signIn()}
                                className="inline-flex items-center gap-3 bg-white hover:bg-zinc-200 text-zinc-900 font-bold py-3 px-8 text-xs uppercase tracking-widest transition-colors"
                            >
                                <GoogleIcon />
                                Continuar con Google
                            </button>
                        </div>
                    ) : success ? (
                        <StateMessage
                            icon={
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            }
                            title="¡Postulación enviada!"
                            description="Recibimos tus datos correctamente. Revisa tu correo en los próximos días para conocer los siguientes pasos."
                            action={
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-8 py-3 bg-[#ED1C24] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Cerrar
                                </button>
                            }
                        />
                    ) : alreadyApplied ? (
                        <AlreadyAppliedState
                            status={
                                myApplication?.application?.status ?? "pendiente"
                            }
                            onClose={handleClose}
                        />
                    ) : (
                        <form
                            id="application-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            {error && (
                                <div className="border border-red-900/50 bg-red-950/20 px-4 py-3">
                                    <p className="text-sm text-red-400">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className={labelClass}
                                    >
                                        Nombres *
                                    </label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        value={form.first_name}
                                        onChange={(e) =>
                                            updateField(
                                                "first_name",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="Juan"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className={labelClass}
                                    >
                                        Apellidos *
                                    </label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        value={form.last_name}
                                        onChange={(e) =>
                                            updateField(
                                                "last_name",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="Pérez"
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="email"
                                        className={labelClass}
                                    >
                                        Correo
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={user?.email ?? ""}
                                        className={`${inputClass} cursor-not-allowed`}
                                        disabled
                                        readOnly
                                    />
                                    <p className="mt-2 text-[11px] text-zinc-600">
                                        Se toma de tu cuenta de Google.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className={labelClass}
                                    >
                                        Teléfono *
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            updateField("phone", e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="987654321"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="codigo_uni"
                                        className={labelClass}
                                    >
                                        Código UNI *
                                    </label>
                                    <input
                                        id="codigo_uni"
                                        type="text"
                                        value={form.codigo_uni}
                                        onChange={(e) =>
                                            updateField(
                                                "codigo_uni",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="20211234A"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="career"
                                        className={labelClass}
                                    >
                                        Carrera *
                                    </label>
                                    <input
                                        id="career"
                                        type="text"
                                        value={form.career}
                                        onChange={(e) =>
                                            updateField(
                                                "career",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="Ingeniería Industrial"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="university_semester"
                                        className={labelClass}
                                    >
                                        Ciclo *
                                    </label>
                                    <input
                                        id="university_semester"
                                        type="text"
                                        value={form.university_semester}
                                        onChange={(e) =>
                                            updateField(
                                                "university_semester",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="8"
                                        disabled={submitting}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="first_choice_area_id"
                                        className={labelClass}
                                    >
                                        Área · primera opción *
                                    </label>
                                    <select
                                        id="first_choice_area_id"
                                        value={form.first_choice_area_id}
                                        onChange={(e) =>
                                            updateField(
                                                "first_choice_area_id",
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClass} cursor-pointer`}
                                        disabled={submitting}
                                    >
                                        <option value="">
                                            Selecciona un área
                                        </option>

                                        {areas.map((area) => (
                                            <option
                                                key={area.area_id}
                                                value={area.area_id}
                                            >
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="second_choice_area_id"
                                        className={labelClass}
                                    >
                                        Área · segunda opción
                                    </label>
                                    <select
                                        id="second_choice_area_id"
                                        value={form.second_choice_area_id}
                                        onChange={(e) =>
                                            updateField(
                                                "second_choice_area_id",
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClass} cursor-pointer`}
                                        disabled={submitting}
                                    >
                                        <option value="">
                                            Sin segunda opción (opcional)
                                        </option>

                                        {areas
                                            .filter(
                                                (area) =>
                                                    String(area.area_id) !==
                                                    form.first_choice_area_id,
                                            )
                                            .map((area) => (
                                                <option
                                                    key={area.area_id}
                                                    value={area.area_id}
                                                >
                                                    {area.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="application_reason"
                                    className={labelClass}
                                >
                                    ¿Por qué quieres unirte? *
                                </label>
                                <textarea
                                    id="application_reason"
                                    value={form.application_reason}
                                    onChange={(e) =>
                                        updateField(
                                            "application_reason",
                                            e.target.value,
                                        )
                                    }
                                    rows={4}
                                    className={`${inputClass} resize-y`}
                                    placeholder="Cuéntanos qué te motiva a formar parte de SupplyMentum..."
                                    disabled={submitting}
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Pie con acciones */}
                {showForm && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-[#0A0A0C]">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            form="application-form"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 bg-[#ED1C24] hover:bg-red-700 text-white font-bold py-3 px-8 uppercase tracking-widest text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enviando
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Enviar postulación
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
        </ModalPortal>
    );
}

function AlreadyAppliedState({
    status,
    onClose,
}: {
    status: "pendiente" | "aceptado" | "rechazado";
    onClose: () => void;
}) {
    const config = {
        pendiente: {
            icon: <Clock className="w-12 h-12 text-amber-500" />,
            title: "Tu postulación está en revisión",
            description:
                "Ya recibimos tu postulación con esta cuenta. Te escribiremos por correo cuando tengamos novedades.",
        },
        aceptado: {
            icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
            title: "¡Tu postulación fue aceptada!",
            description:
                "Revisa tu correo: ahí te enviamos los siguientes pasos para sumarte al equipo.",
        },
        rechazado: {
            icon: <XCircle className="w-12 h-12 text-zinc-500" />,
            title: "Tu postulación no fue seleccionada",
            description:
                "Gracias por postular. Te invitamos a intentarlo nuevamente en la siguiente convocatoria.",
        },
    }[status];

    return (
        <StateMessage
            icon={config.icon}
            title={config.title}
            description={config.description}
            action={
                <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 bg-[#ED1C24] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    Cerrar
                </button>
            }
        />
    );
}

function StateMessage({
    icon,
    title,
    description,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center text-center gap-4 py-12">
            {icon}

            <h4 className="text-xl font-bold text-white">{title}</h4>

            <p className="text-sm text-zinc-400 max-w-md">{description}</p>

            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
        </svg>
    );
}
