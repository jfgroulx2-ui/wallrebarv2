export default function LengthTable({ derived, rebar }) {
  const rows = [
    ["Vert. ext.", rebar.vert_ext.size, derived.vert_ext],
    ["Vert. int.", rebar.vert_int.size, derived.vert_int],
    ["Horiz. ext.", rebar.horiz_ext.size, derived.horiz_ext],
    ["Horiz. int.", rebar.horiz_int.size, derived.horiz_int],
    ["Epingles", rebar.ties.size, derived.ties],
  ];

  return (
    <div className="card">
      <div className="card-header">
        <strong>Tableau des longueurs CSA</strong>
        <span>Mise a jour en temps reel</span>
      </div>
      <table className="length-table">
        <thead>
          <tr>
            <th>Element</th>
            <th>Barre</th>
            <th>ld</th>
            <th>ldc</th>
            <th>ldh</th>
            <th>ls A</th>
            <th>ls B</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, bar, data]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{bar}</td>
              <td>{data.ld}</td>
              <td>{data.ldc}</td>
              <td>{data.ldh}</td>
              <td>{data.ls_A}</td>
              <td>{data.ls_B}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
