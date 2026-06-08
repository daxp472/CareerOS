import { Card } from "@/components/ui";

export function TableCard({ title, columns, rows }: { title: string; columns: string[]; rows: Array<Array<string>> }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-2">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/40 text-slate-200">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-4">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
