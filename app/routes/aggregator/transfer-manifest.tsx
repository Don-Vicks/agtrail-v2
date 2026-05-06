import {
   CheckCircle2,
   Download,
   Printer,
   QrCode
} from 'lucide-react';
import { PageHeader } from '~/components/page-header';
import { Button } from '~/components/ui/button';

export default function AggregatorTransferManifestPage() {
   return (
      <div className="space-y-6 pb-20">
         <PageHeader
            items={[
               { label: 'Aggregator', href: '/aggregator' },
               { label: 'Transfer' },
               { label: 'Transit Manifest' }
            ]}
            action={
               <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-9 px-4 text-xs font-bold text-gray-600 rounded-md border-gray-200 gap-2">
                     <Printer className="size-4" />
                     Print Document
                  </Button>
                  <Button
                     className="bg-brand hover:bg-brand/90 text-white rounded-md h-9 px-4 text-xs font-bold gap-2"
                  >
                     <Download className="size-4" />
                     Download PDF
                  </Button>
               </div>
            }
         />

         <div className="space-y-1">
            <h1 className="text-2xl font-bold text-brand">Transit Manifest</h1>
            <p className="text-sm text-gray-500">Official Shipment</p>
         </div>

         <div className="border-y-2 border-gray-100 bg-white p-16 shadow-sm relative overflow-hidden max-w-[1000px] mx-auto">
            {/* Authenticity Stamp */}
            <div className="absolute top-[45%] right-[9%] rotate-[-15deg] opacity-20 pointer-events-none">
               <div className="border-2 border-[#c7c8ca] rounded-[12px] p-3 text-center">
                  <h4 className="text-3xl font-[900] text-[#c7c8ca] uppercase tracking-tighter">AUTHORIZED</h4>
                  <p className="text-[10px] font-black text-[#c7c8ca] uppercase tracking-[0.2em] mt-0.5">Logistics Verified</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10">
               <ManifestSection title="AGGREGATOR (ORIGIN)" name="Global Logistics Partners LLC" detail="Facility ID: WH-NORTH-422\n102 Industrial Way, Port District\nNew York, NY 10001\nContact: logistics-ops@glp.corp" />
               <ManifestSection title="RECEIVER (DESTINATION)" name="Advanced Retail Distribution" detail="Facility ID: DIST-HUB-09\n88 Logistics Cir, East Campus\nChicago, IL 60601\nContact: intake@adv-retail.com" />
            </div>

            <div className="grid grid-cols-3 mb-16 gap-4">
               <ManifestMetric label="CARRIER DETAILS" value="SwiftTrans Intermodal" sub="Fleet ID: T-992-K" />
               <ManifestMetric label="PACKAGE COUNT" value="148 Units (6 Pallets)" sub="Class: A-Prime" />
               <ManifestMetric label="EST. ARRIVAL" value="OCT 27, 2023" sub="TZ: EST (UTC-5)" />
            </div>

            <div className="space-y-4 mb-12">
               <h4 className="text-[9px] font-[900] text-gray-900 uppercase tracking-[0.2em]">TRANSFER INVENTORY DETAIL</h4>
               <div className="border-t border-gray-100">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-100">
                           <th className="py-3 text-[9px] font-[900] uppercase tracking-widest text-brand">SKU/BATCH ID</th>
                           <th className="py-3 text-[9px] font-[900] uppercase tracking-widest text-brand">DESCRIPTION</th>
                           <th className="py-3 text-center text-[9px] font-[900] uppercase tracking-widest text-brand">QUANTITY</th>
                           <th className="py-3 text-right text-[9px] font-[900] uppercase tracking-widest text-brand">WEIGHT (KG)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        <ManifestRow id="ELC-2294-01" desc="Precision Circuit Modules (Type B)" qty="40" weight="120.00" />
                        <ManifestRow id="IND-X92-A" desc="Fiber-Optic Core Splicers" qty="100" weight="45.50" />
                        <ManifestRow id="SP-002-VAL" desc="Pneumatic Calibration Kit" qty="8" weight="182.40" />
                        <tr className="border-t-2 border-gray-900">
                           <td colSpan={2}></td>
                           <td className="py-4 text-center font-[900] text-gray-900 uppercase text-[10px] tracking-[0.2em]">TOTALS</td>
                           <td className="py-4 text-right">
                              <div className="flex justify-end gap-10">
                                 <span className="font-[900] text-gray-900 text-sm tracking-tighter">148</span>
                                 <span className="font-[900] text-gray-900 text-sm tracking-tighter">347.90</span>
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="rounded-[10px] bg-gray-50 p-4 flex items-center gap-5 mb-12 max-w-[420px]">
               <div className="size-12 rounded-md bg-white border border-gray-200 p-1.5 shadow-sm shrink-0">
                  <QrCode className="size-full text-gray-300 stroke-[1.5]" />
               </div>
               <div>
                  <h4 className="text-sm font-[900] text-brand tracking-tighter leading-none">Digital Tracking Enabled</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">
                     Scan this code with the LogisticsOS Mobile App to verify physical custody transfer and real-time GPS coordinates.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-gray-100">
               <Signature title="AGGREGATOR AUTHORIZATION" name="Sarah Jenkins" hash="8e2a...91f" />
               <Signature title="RECEIVER ACKNOWLEDGEMENT" name="Marcus Thorne" hash="f912...a31" />
            </div>

            <div className="mt-16 text-center space-y-4">
               <p className="text-[8px] text-gray-400 font-bold max-w-xl mx-auto leading-relaxed uppercase tracking-wide">
                  This document serves as a binding transit manifest between the named parties. By signing, the Receiver acknowledges receipt of goods in the specified quantities and conditions for further distribution. Any discrepancies must be logged via the LogisticsOS Digital Portal within 2 hours of transit initiation.
               </p>
               <div className="flex items-center justify-center gap-8 text-[7px] font-[900] text-gray-300 uppercase tracking-[0.2em]">
                  <span>ISO 9001:2015 CERTIFIED</span>
                  <span>SECURITY COMPLIANT (SOC2)</span>
                  <span>DOT-REGULATED #911202</span>
               </div>
            </div>
         </div>
      </div>
   )
}

function ManifestSection({ title, name, detail }: { title: string; name: string; detail: string }) {
   return (
      <div className="space-y-2 flex-1">
         <p className="text-[10px] font-bold text-brand uppercase tracking-wider">{title}</p>
         <div className="p-5 border border-gray-200 rounded-sm bg-white min-h-[140px]">
            <h4 className="text-[15px] font-bold text-brand mb-2 tracking-tight">{name}</h4>
            <div className="space-y-1">
               {detail.split('\\n').map((line, i) => (
                  <p key={i} className="text-[11px] font-medium text-gray-400 leading-tight">{line}</p>
               ))}
            </div>
         </div>
      </div>
   )
}

function ManifestMetric({ label, value, sub }: { label: string; value: string; sub: string }) {
   return (
      <div className="space-y-1 border-l-4 border-black pl-5 py-4 bg-[#f8fafc] flex-1">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
         <h4 className="text-[14px] font-bold text-brand tracking-tight">{value}</h4>
         <p className="text-[11px] font-bold text-gray-600 tracking-tight">{sub}</p>
      </div>
   )
}

function ManifestRow({ id, desc, qty, weight }: { id: string, desc: string, qty: string, weight: string }) {
   return (
      <tr className="hover:bg-gray-50/50 transition-colors">
         <td className="py-3 text-xs font-black text-brand tracking-tighter">{id}</td>
         <td className="py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide">{desc}</td>
         <td className="py-3 text-center text-xs font-black text-gray-900 tracking-tighter">{qty}</td>
         <td className="py-3 text-right text-xs font-black text-gray-900 tracking-tighter">{weight}</td>
      </tr>
   )
}

function Signature({ title, name, hash }: { title: string; name: string; hash: string }) {
   return (
      <div className="space-y-6">
         <p className="text-[9px] font-black text-brand uppercase tracking-[0.25em]">{title}</p>
         <div className="space-y-3">
            <h4 className="text-2xl font-black text-gray-900 tracking-tighter border-b border-gray-900 pb-1 inline-block min-w-[200px]">{name}</h4>
            <div className="space-y-1">
               <div className="flex items-center gap-1.5 text-[8px] font-black text-green-600 uppercase tracking-widest">
                  <CheckCircle2 className="size-2.5" />
                  <span>DIGITALLY SIGNED VIA OIDC-AUTH (HASH: {hash})</span>
               </div>
               <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">TIMESTAMP: 2023-10-24 09:12:44 UTC</p>
            </div>
         </div>
      </div>
   )
}
