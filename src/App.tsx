import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertTriangle, Activity, Layers, Package, PlayCircle, StopCircle, RefreshCw, CircleDot, Clock, Camera, QrCode, Filter, Settings2, X } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, LineChart, Line, Legend } from "recharts";

// ---------- helper types ----------
const sections = [
  "Unloading",
  "Vegetable",
  "Allergen Store",
  "Non-Allergen Store",
  "Paneer",
  "Patty",
  "Kachori",
  "Samosa",
  "Naan",
  "Paratha",
  "Cold Storage & Dispatch",
];

const gates = [
  { id: "TG-1 (ULA)", section: "Unloading", type: "Stock count" },
  { id: "TG-1 (VGT)", section: "Vegetable", type: "Yield counter" },
  { id: "TG-2 (PTA)", section: "Vegetable", type: "Batching" },
  { id: "TG-2 (PTB)", section: "Vegetable", type: "Batching" },
  { id: "TG-1 (RMS)", section: "Allergen Store", type: "Material movement" },
  { id: "TG-2 (ALA)", section: "Allergen Store", type: "Recipe poka-yoke" },
  { id: "TG-1 (RMS)", section: "Non-Allergen Store", type: "Material movement" },
  { id: "TG-2 (NALA)", section: "Non-Allergen Store", type: "Recipe poka-yoke" },
  { id: "TG-4 (PRA)", section: "Paneer", type: "Flowmeter - milk in" },
  { id: "TG-1 (PRB)", section: "Paneer", type: "Chilled paneer out" },
  { id: "TG-2 (X2RA)", section: "Paneer", type: "Packed paneer to FGS" },
  { id: "TG-4 (B)", section: "Paneer", type: "Rejects post X-ray" },
  { id: "TG-3 (PRPKGA)", section: "Paneer", type: "Cold store locator" },
  { id: "TG-2 (X1RA)", section: "Patty", type: "Packed to FGS" },
  { id: "TG-3 (PKGA)", section: "Patty", type: "Cold store locator" },
  { id: "TG-4 (A)", section: "Patty", type: "Rejects post X-ray" },
  { id: "TG-2 (X1RA)", section: "Kachori", type: "Packed to FGS" },
  { id: "TG-3 (PKGA)", section: "Kachori", type: "Cold store locator" },
  { id: "TG-4 (A)", section: "Kachori", type: "Rejects post X-ray" },
  { id: "TG-2 (KCA)", section: "Kachori", type: "Boxes post frying" },
  { id: "TG-2 (X1RA)", section: "Samosa", type: "Packed to FGS" },
  { id: "TG-3 (PKGA)", section: "Samosa", type: "Cold store locator" },
  { id: "TG-4 (A)", section: "Samosa", type: "Rejects post X-ray" },
  { id: "TG-2 (X2RA)", section: "Naan", type: "Packed to FGS" },
  { id: "TG-3 (PKGA)", section: "Naan", type: "Cold store locator" },
  { id: "TG-4 (B)", section: "Naan", type: "Rejects post X-ray" },
  { id: "TG-2 (X2RA)", section: "Paratha", type: "Packed to FGS" },
  { id: "TG-3 (PKGA)", section: "Paratha", type: "Cold store locator" },
  { id: "TG-4 (B)", section: "Paratha", type: "Rejects post X-ray" },
];

// fake live stream generator
function useFakeStream() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const batches = useMemo(() => {
    const now = Date.now();
    const sample = [
      { batch: "VG-2411-001", material: "Potato - Lot P11", gate: "TG-2 (PTA)", qty: 185.2, uom: "kg", ageMin: ((now/1000/60) % 90).toFixed(0), target: 190 },
      { batch: "PN-2411-007", material: "Milk - Tank 2", gate: "TG-4 (PRA)", qty: 980.0, uom: "L", ageMin: ((now/1000/60) % 60).toFixed(0), target: 1000 },
      { batch: "PA-2411-021", material: "Patty - Line 1", gate: "TG-4 (A)", qty: 7, uom: "pcs reject", ageMin: 12, target: 0 },
      { batch: "SM-2411-013", material: "Samosa - Fryer", gate: "TG-4 (A)", qty: 3, uom: "pcs reject", ageMin: 5, target: 0 },
      { batch: "NA-2411-003", material: "Naan - Pack", gate: "TG-2 (X2RA)", qty: 1200, uom: "pcs", ageMin: 18, target: 1200 },
      { batch: "PR-2411-010", material: "Paneer - Pack", gate: "TG-2 (X2RA)", qty: 412, uom: "kg", ageMin: 26, target: 420 },
    ];
    return sample.map((r, i) => ({ ...r, key: i + "-" + tick }));
  }, [tick]);

  const yieldByStep = [
    { step: "Vegetable sorting", fpy: 92, scrap: 8 },
    { step: "Boiling", fpy: 95, scrap: 5 },
    { step: "Frying", fpy: 91, scrap: 9 },
    { step: "X-ray/Pack", fpy: 98, scrap: 2 },
  ];

  const oeeTrend = new Array(12).fill(0).map((_, i) => ({
    t: `T${i+1}`,
    avail: 85 + Math.round(Math.sin((i+tick)/3)*5),
    perf: 88 + Math.round(Math.cos((i+tick)/4)*4),
    qual: 95 + Math.round(Math.sin((i+tick)/5)*3),
  }));

  const coldGrid = Array.from({ length: 6 }).map((_, r) =>
    Array.from({ length: 10 }).map((__, c) => ({
      id: `L${r+1}-P${c+1}`,
      sku: (r + c) % 7 === 0 ? "Paneer" : (r + c) % 5 === 0 ? "Patty" : (r + c) % 3 === 0 ? "Samosa" : "",
      age: ((r*10+c) * 3 + tick) % 72,
    }))
  );

  return { batches, yieldByStep, oeeTrend, coldGrid };
}

function TrafficLight({ value }: { value: "good"|"warn"|"bad" }) {
  const color = value === "good" ? "bg-green-500" : value === "warn" ? "bg-amber-500" : "bg-red-500";
  return <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${color}`}></span><span className="text-xs capitalize">{value}</span></div>;
}

function TopBar() {
  return (
    <div className="w-full flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Layers className="w-5 h-5" />
        <h1 className="text-xl font-semibold">Haldiram Control Room</h1>
        <Badge variant="secondary" className="rounded-2xl">Live</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Search batch / SKU / gate" className="w-64" />
        <Button variant="outline" size="icon"><Filter className="w-4 h-4"/></Button>
        <Button variant="outline" size="icon"><Settings2 className="w-4 h-4"/></Button>
        <Button variant="default" className="gap-2"><RefreshCw className="w-4 h-4"/> Sync</Button>
      </div>
    </div>
  );
}

function KPI({ label, value, sub, intent="neutral" }:{label:string, value:string, sub?:string, intent?:"neutral"|"good"|"bad"}){
  const tint = intent === "good" ? "text-green-600" : intent === "bad" ? "text-red-600" : "text-slate-700";
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">{label}</CardTitle></CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${tint}`}>{value}</div>
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function YieldByProcess({ data }:{ data: any[] }){
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm">Yield by process - last hour</CardTitle></CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="step" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <RTooltip />
            <Legend />
            <Bar dataKey="fpy" name="FPY %" />
            <Bar dataKey="scrap" name="Scrap %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function OEETrend({ data }:{ data:any[] }){
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm">OEE components - trend</CardTitle></CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fontSize: 12 }} />
            <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
            <RTooltip />
            <Legend />
            <Line type="monotone" dataKey="avail" name="Availability" />
            <Line type="monotone" dataKey="perf" name="Performance" />
            <Line type="monotone" dataKey="qual" name="Quality" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function LiveBatchTable({ rows }:{ rows:any[] }){
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Live material & batch movement</CardTitle>
        <Badge variant="outline" className="rounded-2xl flex gap-1 items-center"><Clock className="w-3 h-3"/> last 60 min</Badge>
      </CardHeader>
      <CardContent className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500">
            <tr className="text-left">
              <th className="py-2">Batch</th>
              <th>Material</th>
              <th>Gate</th>
              <th className="text-right">Qty</th>
              <th>UOM</th>
              <th className="text-right">Target</th>
              <th className="text-right">Delta</th>
              <th className="text-right">Age (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any) => {
              const delta = Number((r.qty - r.target).toFixed(1));
              const intent = delta < -5 ? "text-red-600" : delta > 5 ? "text-green-600" : "";
              return (
                <tr key={r.key} className="border-t">
                  <td className="py-2 font-medium">{r.batch}</td>
                  <td>{r.material}</td>
                  <td className="whitespace-nowrap">{r.gate}</td>
                  <td className="text-right">{r.qty}</td>
                  <td>{r.uom}</td>
                  <td className="text-right">{r.target}</td>
                  <td className={`text-right ${intent}`}>{delta}</td>
                  <td className="text-right">{r.ageMin}</td>
                  <td className="flex gap-2 justify-end">
                    <Button size="icon" variant="ghost" title="Open camera"><Camera className="w-4 h-4"/></Button>
                    <Button size="icon" variant="ghost" title="Trace genealogy"><QrCode className="w-4 h-4"/></Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function SectionHealth() {
  const health = [
    { name: "Unloading", status: "good", wip: 3 },
    { name: "Vegetable", status: "warn", wip: 6 },
    { name: "Allergen Store", status: "good", wip: 2 },
    { name: "Non-Allergen Store", status: "good", wip: 1 },
    { name: "Paneer", status: "warn", wip: 5 },
    { name: "Patty", status: "bad", wip: 7 },
    { name: "Kachori", status: "good", wip: 4 },
    { name: "Samosa", status: "good", wip: 4 },
    { name: "Naan", status: "good", wip: 3 },
    { name: "Paratha", status: "warn", wip: 5 },
  ] as const;
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm">Section status</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {health.map(s => (
          <div key={s.name} className="flex flex-col items-center justify-center p-3 rounded-xl border hover:bg-slate-50 transition-colors">
            <div className="text-xs font-medium text-center mb-2">{s.name}</div>
            <div className="flex items-center gap-2 flex-col">
              <Badge variant="outline" className="rounded-full text-xs">WIP {s.wip}</Badge>
              <TrafficLight value={s.status as any}/>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AlarmPanel(){
  const alarms = [
    { id: 1, time: "10:02", text: "Patty rejects above limit at TG-4 (A)", sev: "High" },
    { id: 2, time: "09:57", text: "Paneer coagulation yield -2% vs target", sev: "Medium" },
    { id: 3, time: "09:49", text: "FIFO breach risk - Cold store Lane L3P4 older than L3P6", sev: "Low" },
  ];
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Alerts</CardTitle>
        <Badge variant="destructive" className="rounded-2xl flex gap-1 items-center"><AlertTriangle className="w-3 h-3"/> 3</Badge>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-2">
          {alarms.map(a => (
            <li key={a.id} className="flex items-center justify-between p-2 border rounded-xl">
              <div className="flex items-center gap-2">
                <CircleDot className="w-3 h-3"/>
                <span>{a.text}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{a.sev}</Badge>
                <span className="text-xs text-slate-500">{a.time}</span>
                <Button size="sm" variant="ghost">Ack</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ColdStorageGrid({ grid }:{ grid:any[][] }){
  const [selectedCell, setSelectedCell] = useState<any | null>(null);
  
  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-3 flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Cold storage - location & FIFO</CardTitle>
          <Badge variant="outline" className="rounded-2xl text-xs">TG-3 locator</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {grid.flat().map((cell:any) => (
              <button 
                key={cell.id}
                onClick={() => setSelectedCell(cell)}
                className="aspect-square border rounded-lg flex flex-col items-center justify-center p-2 hover:border-blue-500 hover:shadow-md transition-all bg-white cursor-pointer"
              >
                <div className="text-center w-full">
                  <div className="font-bold text-[10px] text-slate-700 mb-1">{cell.id}</div>
                  <div className="text-[9px] font-medium text-slate-600 mb-1 truncate w-full">{cell.sku || "-"}</div>
                  <div className={`text-xs font-bold ${cell.age > 48 ? "text-red-600" : cell.age > 24 ? "text-amber-600" : "text-slate-500"}`}>{cell.age}h</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCell(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-semibold text-lg">Cold Storage Location: {selectedCell.id}</h3>
                <p className="text-sm text-slate-600">SKU: {selectedCell.sku || "Empty"} • Age: {selectedCell.age}h</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedCell(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80" 
                alt={`Cold storage location ${selectedCell.id}`}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/800x600/1e293b/94a3b8?text=Cold+Storage+Facility";
                }}
              />
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium mb-2">Location Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Location ID:</span>
                    <span className="ml-2 font-medium">{selectedCell.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Product:</span>
                    <span className="ml-2 font-medium">{selectedCell.sku || "Empty"}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Storage Age:</span>
                    <span className={`ml-2 font-medium ${selectedCell.age > 48 ? "text-red-600" : selectedCell.age > 24 ? "text-amber-600" : "text-slate-500"}`}>
                      {selectedCell.age} hours
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">FIFO Status:</span>
                    <span className={`ml-2 font-medium ${selectedCell.age > 48 ? "text-red-600" : selectedCell.age > 24 ? "text-amber-600" : "text-green-600"}`}>
                      {selectedCell.age > 48 ? "Critical" : selectedCell.age > 24 ? "Warning" : "OK"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function PlantMapView(){
  const [active, setActive] = useState<any | null>(null);
  const [line, setLine] = useState<string>("Patty Line 1");

  // Simple plant coordinate system (0-100). One map per manufacturing line.
  const nodes = [
    { name: "Raw Store", x: 6, y: 72 },
    { name: "Prep", x: 20, y: 60 },
    { name: "Forming", x: 38, y: 52 },
    { name: "Fryer", x: 56, y: 48 },
    { name: "X-ray", x: 70, y: 44 },
    { name: "Packing", x: 82, y: 42 },
    { name: "Cold Store", x: 92, y: 30 },
  ];

  // Example live batches plotted on the map
  const markers = [
    { batch: "PA-2411-021", sku: "Patty 1kg", at: "X-ray", status: "warn", qty: 7, uom: "pcs reject", x: 70, y: 44, gate: "TG-4 (A)" },
    { batch: "PA-2411-024", sku: "Patty 1kg", at: "Fryer", status: "good", qty: 520, uom: "pcs", x: 56, y: 48, gate: "TG-2 (KCA)" },
    { batch: "PA-2411-025", sku: "Patty 1kg", at: "Packing", status: "good", qty: 480, uom: "pcs", x: 82, y: 42, gate: "TG-2 (X1RA)" },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm">Plant map - {line}</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={line} onValueChange={setLine}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Choose line"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="Patty Line 1">Patty Line 1</SelectItem>
              <SelectItem value="Samosa Line">Samosa Line</SelectItem>
              <SelectItem value="Paneer Line">Paneer Line</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="rounded-2xl">Map view</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 rounded-2xl border overflow-hidden">
          {/* faux map background */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />

          {/* stations */}
          {nodes.map(n => (
            <div key={n.name} className="absolute -translate-x-1/2 text-[10px] text-center" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <div className="w-2 h-2 rounded-full bg-slate-500 mx-auto mb-1"></div>
              <div className="bg-white/90 px-1 py-0.5 rounded border shadow-sm whitespace-nowrap">{n.name}</div>
            </div>
          ))}

          {/* batch markers */}
          {markers.map(m => (
            <button key={m.batch}
              onClick={() => setActive(m)}
              title={`${m.batch} @ ${m.at}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow border ${m.status === 'good' ? 'bg-green-100 border-green-400' : m.status === 'warn' ? 'bg-amber-100 border-amber-400' : 'bg-red-100 border-red-400'}`}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}>
              <Package className="w-4 h-4" />
            </button>
          ))}

          {/* detail panel on marker click */}
          {active && (
            <div className="absolute top-3 right-3 w-80 bg-white rounded-2xl border shadow-xl p-3">
              <div className="flex items-start justify-between">
      <div>
                  <div className="text-sm font-semibold">{active.batch} <span className="text-slate-400">· {active.sku}</span></div>
                  <div className="text-xs text-slate-500">At {active.at} - {active.gate}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setActive(null)}>Close</Button>
              </div>
              <div className="mt-2 text-sm">
                <div className="flex items-center justify-between"><span>Qty</span><span className="font-medium">{active.qty} {active.uom}</span></div>
                <div className="flex items-center justify-between"><span>Status</span><span className={`font-medium ${active.status === 'good' ? 'text-green-600' : active.status === 'warn' ? 'text-amber-600' : 'text-red-600'}`}>{active.status}</span></div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" className="gap-1"><Camera className="w-3 h-3"/> Camera</Button>
                <Button variant="outline" size="sm" className="gap-1"><QrCode className="w-3 h-3"/> Genealogy</Button>
                <Button size="sm" className="gap-1"><Activity className="w-3 h-3"/> Open batch</Button>
              </div>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-2">Map uses plant coordinates (not GPS). Markers represent batches per line; click for drilldown.</div>
      </CardContent>
    </Card>
  );
}


export default function App(){
  const { batches, yieldByStep, oeeTrend, coldGrid } = useFakeStream();

  return (
    <TooltipProvider>
    <div className="p-4 md:p-6 space-y-4">
      <TopBar/>

      {/* Fun animated line map at top */}
      <PlantMapView/>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <KPI label="Throughput - last hr" value="5,420 pcs" sub="All SKUs" />
        <KPI label="FPY - last hr" value="95.2%" intent="good" sub="Target 94%" />
        <KPI label="Scrap rate" value="4.1%" sub="Plant" />
        <KPI label="WIP batches" value="31" />
        <KPI label="Cold store age (P95)" value="36h" intent="bad" />
        <KPI label="Open alerts" value="3" intent="bad" />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="space-y-4 xl:col-span-2">
          <LiveBatchTable rows={batches}/>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <YieldByProcess data={yieldByStep}/>
            <OEETrend data={oeeTrend}/>
          </div>
        </div>

        <div className="space-y-4">
          <AlarmPanel/>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Gate filters</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-2">
              <Select defaultValue="All">
                <SelectTrigger className="w-40"><SelectValue placeholder="Section" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All sections</SelectItem>
                  {sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select defaultValue="All">
                <SelectTrigger className="w-40"><SelectValue placeholder="Gate" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All gates</SelectItem>
                  {gates.map(g => <SelectItem key={g.id} value={g.id}>{g.id}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2"><PlayCircle className="w-4 h-4"/> Start</Button>
              <Button variant="outline" className="gap-2"><StopCircle className="w-4 h-4"/> Stop</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full-width sections */}
      <div className="space-y-4">
        <SectionHealth/>
        <ColdStorageGrid grid={coldGrid}/>
      </div>

      {/* Map view - per item manufacturing line */}
      <PlantMapView/>

      {/* Footer */}
      <div className="text-xs text-slate-500 text-center pt-2">Mock data. Streams expected from PLC/CCTV/weight/BLE via MQTT/Kafka. Genealogy & traceability available on batch drilldown.</div>
    </div>
    </TooltipProvider>
  );
}
