import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { DollarSign, Zap, TrendingDown, AlertCircle, Settings, Upload, Play, Pause } from 'lucide-react';

export default function ShopifyOptimizer() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [optimizing, setOptimizing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    optimized: 0,
    totalTokensSaved: 0,
    totalCostSaved: 0,
    avgOptimization: 0,
    monthlyProjection: 0,
  });

  // Datos simulados para dashboard
  const dashboardData = {
    dailySavings: [
      { day: 'Lun', ahorro: 240, productos: 15 },
      { day: 'Mar', ahorro: 380, productos: 22 },
      { day: 'Mié', ahorro: 520, productos: 31 },
      { day: 'Jue', ahorro: 380, productos: 24 },
      { day: 'Vie', ahorro: 640, productos: 38 },
      { day: 'Sab', ahorro: 480, productos: 28 },
      { day: 'Dom', ahorro: 320, productos: 18 },
    ],
    optimizationBreakdown: [
      { name: 'Títulos', value: 25, color: '#fbbf24' },
      { name: 'Descripciones', value: 60, color: '#10b981' },
      { name: 'Tags', value: 15, color: '#3b82f6' },
    ],
    tokensVsQuality: [
      { tokens: 50, quality: 78, name: 'Producto A' },
      { tokens: 120, quality: 92, name: 'Producto B' },
      { tokens: 85, quality: 88, name: 'Producto C' },
      { tokens: 200, quality: 85, name: 'Producto D' },
      { tokens: 45, quality: 80, name: 'Producto E' },
    ],
  };

  useEffect(() => {
    // Simular carga de datos
    setStats({
      totalProducts: 1247,
      optimized: 945,
      totalTokensSaved: 284500,
      totalCostSaved: 8.54,
      avgOptimization: 38,
      monthlyProjection: 256.2,
    });
  }, []);

  const handleOptimizeProducts = async () => {
    setOptimizing(true);
    // Simular proceso
    setTimeout(() => {
      setOptimizing(false);
      setStats(prev => ({
        ...prev,
        totalCostSaved: prev.totalCostSaved + 24.5,
        monthlyProjection: prev.monthlyProjection + 73.5,
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">DescriptionPro</h1>
                <p className="text-sm text-slate-500">Optimiza descripciones, ahorra dinero</p>
              </div>
            </div>
            <button
              onClick={handleOptimizeProducts}
              disabled={optimizing}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {optimizing ? (
                <>
                  <Pause className="w-4 h-4 animate-spin" /> Optimizando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Optimizar Ahora
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'products', label: '📦 Productos', icon: '📦' },
              { id: 'settings', label: '⚙️ Configuración', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard
                title="Costo Ahorrado"
                value={`$${stats.totalCostSaved.toFixed(2)}`}
                icon={<DollarSign className="w-6 h-6" />}
                color="emerald"
                subtitle="Este mes"
              />
              <KPICard
                title="Tokens Guardados"
                value={`${(stats.totalTokensSaved / 1000).toFixed(1)}K`}
                icon={<Zap className="w-6 h-6" />}
                color="yellow"
                subtitle="Total"
              />
              <KPICard
                title="Optimización Promedio"
                value={`${stats.avgOptimization}%`}
                icon={<TrendingDown className="w-6 h-6" />}
                color="blue"
                subtitle="Reducción"
              />
              <KPICard
                title="Proyección Mensual"
                value={`$${stats.monthlyProjection.toFixed(2)}`}
                icon={<AlertCircle className="w-6 h-6" />}
                color="purple"
                subtitle="Si continúa"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ahorros diarios */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Ahorros Diarios</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.dailySavings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="ahorro" fill="#10b981" name="Ahorro ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.optimizationBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.optimizationBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tokens vs Calidad</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tokens" name="Tokens" />
                  <YAxis dataKey="quality" name="Quality Score" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Productos" data={dashboardData.tokensVsQuality} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-600 mt-4">
                💡 Nota: Optimizamos sin sacrificar calidad. Mantén el balance.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Productos Optimizados</h3>
                <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  {stats.optimized}/{stats.totalProducts}
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tokens Originales</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tokens Optimizados</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ahorro</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Winter Jacket Pro', original: 145, optimized: 89, saving: 38 },
                    { name: 'Summer T-Shirt', original: 98, optimized: 61, saving: 38 },
                    { name: 'Denim Jeans Blue', original: 167, optimized: 103, saving: 38 },
                    { name: 'Leather Belt Premium', original: 112, optimized: 69, saving: 38 },
                    { name: 'Casual Sneakers', original: 189, optimized: 117, saving: 38 },
                  ].map((product, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product.original}</td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">{product.optimized}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-semibold">
                          -{product.saving}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                          ✓ Optimizado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Configuración de Optimización
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nivel de Agresividad
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Conservador (máximo 20% reducción)</option>
                    <option selected>Balanceado (30-40% reducción)</option>
                    <option>Agresivo (50%+ reducción)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Qué optimizar
                  </label>
                  <div className="space-y-2">
                    {['Títulos', 'Descripciones', 'Tags Meta', 'SEO'].map(item => (
                      <label key={item} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calidad Mínima Permitida
                  </label>
                  <input type="range" min="0" max="100" defaultValue="85" className="w-full" />
                  <p className="text-xs text-slate-500 mt-1">Nunca optimizar por debajo del 85%</p>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition">
                  Guardar Cambios
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-blue-800">
                Optimiza primero con nivel "Balanceado", luego A/B test vs descripciones originales. 
                Datos muestran que el 92% de clientes NO notan diferencia con 40% menos tokens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color, subtitle }) {
  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
