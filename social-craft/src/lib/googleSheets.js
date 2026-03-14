// ============================================
// FILE: googleSheets.js
// PURPOSE: Sends frontend form and click-tracking data to a Google Apps Script endpoint
// USES: NEXT_PUBLIC_GOOGLE_SHEET_URL from environment variables
// ============================================

/*
Google Apps Script Web App example:

function doPost(e) {
  const { sheet, data } = JSON.parse(e.postData.contents)
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ws = ss.getSheetByName(sheet)
  const row = Object.values(data)
  ws.appendRow([new Date(), ...row])
  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON)
}
*/

export async function saveToSheet(sheetName, data) {
  try {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL;

    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheet: sheetName,
        data: data,
      }),
    })

    return { success: true }
  } catch (error) {
    console.error("Sheet save error:", error)
    return { success: false }
  }
}
