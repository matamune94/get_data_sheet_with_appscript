/* Route
 * All Request with Method Get will be proces here
 */
function doGet(req) {
  console.log(req.parameter)
  const action = req?.parameter?.action;
  
  // ID của sheet
  const idSheet = ''
  // Tên sheet
  const nameSheet = ''

  const db = SpreadsheetApp.openById(idSheet);

  // Don't forget to change your Sheet Name by default is 'Sheet1'
  const sheet = db.getSheetByName(nameSheet);

  switch (action) {
    case "list":
      return getList(req, sheet);
      break;
    case "getById":
      return getById(req, sheet);
      break;
    // case "insert":
    //   return doInsert(req, sheetUsers);
    //   break;
    // case "update":
    //   return doUpdate(req, sheetUsers);
    //   break;
    // case "delete":
    //   return doDelete(req, sheetUsers);
    //   break;
    default:
      return response({
        status: false,
        message: 'silent!'
      })
  }
}

function getList(req, sheet) {
  const data = sheet.getDataRange().getValues();
  const heads = data[0]
  const items = data.slice(1).reduce((o, v, idx) => {
    const obj = {}
    for (let i = 0; i < heads.length; i++) {
        const head = heads[i]
        obj[head] = v[i]
    }
    o.push(obj)
    return o
  }, [])
  const jsonData = JSON.stringify(items);
  
  const response = ContentService.createTextOutput(jsonData);
  response.setMimeType(ContentService.MimeType.JSON);
  
  return response;
}

function demoRun() {
    const db = SpreadsheetApp.openById("1LRpxVNQmoySWFCb494-dmrBM1oVXFHaDr7PsBnM_iwI");

    // Don't forget to change your Sheet Name by default is 'Sheet1'
    const sheet = db.getSheetByName("2. Hứng");
    getById({ parameter: { id: "HMT93408" } }, sheet)
}

function getById(req, sheet) {
  const { id } = req.parameter
  if(!id) {
    return 'Need Id'
  }


  var columnToSearch = 1; // Chỉ số cột cần tìm kiếm (1 là cột A, 2 là cột B, và cứ thế)
  var valueToFind = id;

  var range = sheet.getDataRange();
  var data = range.getValues();

  var foundRow = data.find(function(row) {
    return row[columnToSearch - 1] == valueToFind;
  });

  if(!foundRow) {
    return response({})
  }
  const row = convertRow(sheet, foundRow)
  //console.log(row)
  return response(row)
}

function convertRow(sheet, items) {
  const heads = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const item = heads.reduce((o, v, idx) => {
    o[v] = items[idx]
    return o
  }, {})
  return item
}

function response(data) {
  const result = ContentService.createTextOutput(JSON.stringify(data));
  result.setMimeType(ContentService.MimeType.JSON);
  
  return result;
}
