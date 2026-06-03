"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiChartsProps {
  dataActivites: { nom: string; inscrits: number }[];
  dataSexe: { nom: string; valeur: number }[];
  dataPresences: { jour: string; present: number; absent: number }[];
}

const COLORS = ["#f97316", "#1e3a5f", "#22c55e", "#fbbf24", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export function KpiCharts({ dataActivites, dataSexe, dataPresences }: KpiChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inscrits par activité */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Inscrits par activité</CardTitle>
        </CardHeader>
        <CardContent>
          {dataActivites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dataActivites} margin={{ left: -20, right: 10 }}>
                <XAxis dataKey="nom" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => [`${v} inscrits`, "Participants"]}
                />
                <Bar dataKey="inscrits" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Répartition Garçons / Filles */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Répartition par sexe</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {dataSexe.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8">Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={dataSexe}
                  dataKey="valeur"
                  nameKey="nom"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {dataSexe.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={10} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Présences sur 7 jours */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Présences — 7 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          {dataPresences.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun pointage effectué cette semaine.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dataPresences} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="jour" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend iconSize={10} />
                <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Présents" />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Absents" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
