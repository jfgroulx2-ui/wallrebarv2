import { BARS } from "../../constants/csaData.js";
import { computeBarLengths } from "../../utils/calculations.js";
import { getExtension, getRayon, getSurcroit } from "../../utils/hookGeometry.js";

export default function TabReference({ geometry }) {
  const rows = Object.keys(BARS).map((size) => ({
    size,
    lengths: computeBarLengths(size, geometry),
    rayon: getRayon(size),
    ext90: getExtension(size, 90).ext,
    ext180: getExtension(size, 180).ext,
    ext135: getExtension(size, 135).ext,
    sur90: getSurcroit(size, 90),
    sur180: getSurcroit(size, 180),
    sur135: getSurcroit(size, 135),
  }));

  return (
    <div className="card">
      <div className="card-header">
        <strong>Reference CSA</strong>
        <span>f'c {geometry.fc} MPa | fy {geometry.fy} MPa</span>
      </div>
      <table className="length-table">
        <thead>
          <tr>
            <th>Barre</th>
            <th>ld</th>
            <th>ldc</th>
            <th>ldh</th>
            <th>ls A</th>
            <th>ls B</th>
            <th>r int</th>
            <th>90°</th>
            <th>180°</th>
            <th>135°</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size}>
              <td>{row.size}</td>
              <td>{row.lengths.ld}</td>
              <td>{row.lengths.ldc}</td>
              <td>{row.lengths.ldh}</td>
              <td>{row.lengths.ls_A}</td>
              <td>{row.lengths.ls_B}</td>
              <td>{Math.round(row.rayon)}</td>
              <td>{Math.round(row.ext90)} / {row.sur90}</td>
              <td>{Math.round(row.ext180)} / {row.sur180}</td>
              <td>{Math.round(row.ext135)} / {row.sur135}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
