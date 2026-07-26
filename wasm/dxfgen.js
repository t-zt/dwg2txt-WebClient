// 浏览器端 DXF 生成（使用模板）
// 从 /template.dxf 加载模板，替换坐标后返回完整 DXF
var _templateDxfText = null;

async function loadTemplate() {
  if (_templateDxfText) return _templateDxfText;
  var r = await fetch('/template.dxf');
  if (!r.ok) throw new Error('模板加载失败: ' + r.status);
  _templateDxfText = await r.text();
  return _templateDxfText;
}

function generateDxfFromTemplate(coords, templateText) {
  if (coords.length === 0) return null;
  var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (var i = 0; i < coords.length; i++) {
    var c = coords[i];
    if (c.x < minX) minX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.x > maxX) maxX = c.x;
    if (c.y > maxY) maxY = c.y;
  }
  var lines = templateText.split(String.fromCharCode(10));
  var polyStart = -1, n90Line = -1, coordStart = -1, coordEnd = -1;
  var inPoly = false;
  for (var i = 0; i < lines.length; i++) {
    var t = lines[i].trim();
    if (t === 'LWPOLYLINE') { polyStart = i - 1; inPoly = true; continue; }
    if (inPoly && t === '90') { n90Line = i; continue; }
    if (inPoly && t === '10' && coordStart < 0) coordStart = i;
    if (inPoly && t === '0' && i > polyStart + 1) { if (coordEnd < 0) coordEnd = i; break; }
    if (inPoly && t === 'ENDSEC') { if (coordEnd < 0) coordEnd = i; break; }
  }
  if (polyStart < 0 || n90Line < 0) throw new Error('模板中未找到 LWPOLYLINE');
  if (coordEnd < 0) coordEnd = lines.length;
  var numVerts = parseInt(lines[n90Line + 1], 10);
  var firstNonCoord = coordStart + 4 * numVerts;
  var newCoordLines = [];
  for (var i = 0; i < coords.length; i++) {
    newCoordLines.push(' 10', coords[i].x.toFixed(3));
    newCoordLines.push(' 20', coords[i].y.toFixed(3));
  }
  var resultLines = [];
  for (var i = 0; i < lines.length; i++) {
    if (i >= coordStart && i < firstNonCoord) {
      if (i === coordStart) resultLines.push.apply(resultLines, newCoordLines);
      continue;
    }
    if (i === n90Line) {
      resultLines.push(lines[i]);
      resultLines.push(coords.length.toString());
      i++;
      continue;
    }
    resultLines.push(lines[i]);
  }
  var resultText = resultLines.join(String.fromCharCode(10));
  var extMin = minX.toFixed(3), extMax = maxX.toFixed(3);
  var extMinY = minY.toFixed(3), extMaxY = maxY.toFixed(3);
  var NL = String.fromCharCode(10);
  var extMinRe = new RegExp('\\$EXTMIN' + NL + ' 10' + NL + '[\\d.eE+-]+' + NL + ' 20' + NL + '[\\d.eE+-]+', 'g');
  var extMaxRe = new RegExp('\\$EXTMAX' + NL + ' 10' + NL + '[\\d.eE+-]+' + NL + ' 20' + NL + '[\\d.eE+-]+', 'g');
  resultText = resultText.replace(extMinRe, function() {
    return '$EXTMIN' + NL + ' 10' + NL + extMin + NL + ' 20' + NL + extMinY;
  });
  resultText = resultText.replace(extMaxRe, function() {
    return '$EXTMAX' + NL + ' 10' + NL + extMax + NL + ' 20' + NL + extMaxY;
  });
  return resultText;
}