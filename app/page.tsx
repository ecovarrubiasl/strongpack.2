
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Check, Dumbbell, Leaf, Shield, Truck, Tag, Percent, CreditCard, Gift } from "lucide-react";

const PRODUCT = {
  id: "pack-fitness-001",
  name: "Pack Fitness: Whey + Creatina + Omega-3 + Multivitamínico",
  bullets: [
    "Recuperación muscular y energía diaria",
    "Fuerza y rendimiento con creatina monohidratada",
    "Salud cardiovascular y antiinflamatoria con Omega-3",
    "Micronutrientes clave para deportistas (D, B, Zinc, Magnesio)",
  ],
  perks: [
    { icon: <Shield className="w-4 h-4" />, text: "Calidad certificada (GMP/ISP)" },
    { icon: <Truck className="w-4 h-4" />, text: "Despacho 24–72h en Chile" },
    { icon: <Gift className="w-4 h-4" />, text: "Shaker gratis en tu 1ª suscripción" },
  ],
  priceOneTime: 64990,
  priceSubMonthly: 58990,
  compareAt: 69990,
};

const COUPONS: Record<string, { type: "percent" | "amount"; value: number; note?: string }> = {
  FIT10: { type: "percent", value: 10, note: "Código de entrenador" },
  START5000: { type: "amount", value: 5000, note: "Bienvenida" },
};

const AFFILIATES: Record<string, { owner: string; commissionPct: number }> = {
  FITJUAN10: { owner: "Juan Pérez", commissionPct: 10 },
  CROSSFITCARO: { owner: "Carolina Cross", commissionPct: 12 },
};

const CLP = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export default function Storefront() {
  const [subscribe, setSubscribe] = useState(true);
  const [qty, setQty] = useState(1);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);
  const price = subscribe ? PRODUCT.priceSubMonthly : PRODUCT.priceOneTime;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const r = params.get("ref");
      if (r) setRefCode(r.toUpperCase());
      const cu = params.get("coupon");
      if (cu) {
        setCouponInput(cu.toUpperCase());
        if (COUPONS[cu.toUpperCase()]) setAppliedCoupon(cu.toUpperCase());
      }
    }
  }, []);

  const baseSubtotal = price * qty;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = COUPONS[appliedCoupon];
    if (!c) return 0;
    return c.type === "percent" ? Math.round(baseSubtotal * (c.value / 100)) : Math.min(baseSubtotal, c.value);
  }, [appliedCoupon, baseSubtotal]);

  const total = Math.max(0, baseSubtotal - discount);
  const youSave = PRODUCT.compareAt - price > 0 ? PRODUCT.compareAt - price : 0;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (COUPONS[code]) {
      setAppliedCoupon(code);
    } else {
      alert("Código inválido o expirado");
      setAppliedCoupon(null);
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const checkout = () => {
    const line = {
      product_id: PRODUCT.id,
      name: PRODUCT.name,
      subscribe,
      qty,
      unit_price: price,
      subtotal: baseSubtotal,
      coupon: appliedCoupon,
      discount,
      total,
      ref: refCode,
    };
    console.log("Checkout payload:", line);
    alert("Simulación de checkout. Luego conectaremos Webpay.");
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            <span className="font-semibold">StrongPack</span>
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><Leaf className="w-4 h-4" /> Calidades certificadas</span>
            <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Envío 24–72h</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Garantía 7 días</span>
          </div>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto p-6 md:p-10 grid md:grid-cols-2 gap-8 items-start">
        <div>
          <Badge className="mb-3"><Percent className="w-3 h-3 mr-1" /> Ahorra con suscripción</Badge>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {PRODUCT.name}
          </h1>
          <p className="mt-3 text-slate-600 max-w-prose">
            Todo lo que necesitas para entrenar mejor y recuperarte más rápido, en un solo pack mensual: proteína whey, creatina monohidratada, Omega-3 y multivitamínico deportivo.
          </p>

          <ul className="mt-6 space-y-2">
            {PRODUCT.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2"><Check className="w-4 h-4 mt-1" /> <span>{b}</span></li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {PRODUCT.perks.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-white border rounded-full px-3 py-1 shadow-sm">
                {p.icon}<span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Tu selección</span>
              <Badge variant="outline" className="flex items-center gap-1"><Tag className="w-3 h-3" /> Mejor precio</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Tipo de compra</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${!subscribe ? "font-semibold" : "text-slate-500"}`}>Única</span>
                <Toggle pressed={subscribe} onPressedChange={setSubscribe} className="px-3">{subscribe ? "Suscripción" : "Cambiar"}</Toggle>
                <span className={`text-xs ${subscribe ? "font-semibold" : "text-slate-500"}`}>Suscripción</span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold">{CLP(price)}</div>
                {youSave > 0 && (
                  <div className="text-xs text-slate-500">Precio normal {CLP(PRODUCT.compareAt)} · Ahorra {CLP(youSave)}</div>
                )}
                {subscribe && <div className="text-xs text-emerald-600 font-medium mt-1">Incluye shaker gratis en el 1º envío</div>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 border rounded-lg">–</button>
                <div className="w-10 text-center">{qty}</div>
                <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 border rounded-lg">+</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm flex items-center gap-1" htmlFor="coupon"><Tag className="w-3 h-3" /> ¿Tienes un cupón?</label>
              <div className="flex gap-2">
                <Input id="coupon" placeholder="Ingresa tu código" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                <Button variant="secondary" onClick={applyCoupon}>Aplicar</Button>
                {appliedCoupon && <Button variant="ghost" onClick={clearCoupon}>Quitar</Button>}
              </div>
              {appliedCoupon && (
                <div className="text-xs text-emerald-700">Cupón <b>{appliedCoupon}</b> aplicado. Descuento: {COUPONS[appliedCoupon].type === "percent" ? `${COUPONS[appliedCoupon].value}%` : CLP(COUPONS[appliedCoupon].value)}</div>
              )}
              {refCode && (
                <div className="text-xs text-slate-500">Referencia de afiliado detectada: <b>{refCode}</b>{AFFILIATES[refCode] ? ` · ${AFFILIATES[refCode].owner} (${AFFILIATES[refCode].commissionPct}% comisión)` : ""}</div>
              )}
            </div>

            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{CLP(baseSubtotal)}</span></div>
              <div className="flex justify-between text-sm"><span>Descuento</span><span className="text-emerald-700">– {CLP(discount)}</span></div>
              <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{CLP(total)}</span></div>
            </div>

            <Button className="w-full h-11 text-base flex items-center gap-2" onClick={checkout}><CreditCard className="w-4 h-4" /> Ir a pagar</Button>
            <div className="text-xs text-slate-500 text-center">Pagos seguros · Cancela tu suscripción cuando quieras</div>
          </CardContent>
        </Card>
      </header>

      <section className="max-w-5xl mx-auto p-6 md:p-10 grid md:grid-cols-3 gap-6">
        {[{
          title: "Proteína Whey 1 kg",
          desc: "Recupera y construye masa muscular. Sabores: vainilla, chocolate, frutilla.",
        }, {
          title: "Creatina 300 g",
          desc: "Aumenta fuerza y potencia. Monohidratada, micronizada.",
        }, {
          title: "Omega-3 30 cáps",
          desc: "Apoya la salud cardiovascular y reduce la inflamación.",
        }, {
          title: "Multivitamínico 30 cáps",
          desc: "Vitaminas D, B, Zinc y Magnesio para rendimiento integral.",
        }].map((p, i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{p.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <footer className="max-w-5xl mx-auto p-10 text-sm text-slate-500">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-slate-700 mb-2">StrongPack</div>
            <p>Suplementos de calidad para entrenar mejor. Fabricación certificada y envíos rápidos en Chile.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-700 mb-2">Afiliados</div>
            <p>Comparte tu código y gana comisión por cada venta. Agrega <code>?ref=FITJUAN10</code> al enlace.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-700 mb-2">Soporte</div>
            <p>contacto@strongpack.cl · @strongpack</p>
          </div>
        </div>
        <div className="mt-6">© {new Date().getFullYear()} StrongPack. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
