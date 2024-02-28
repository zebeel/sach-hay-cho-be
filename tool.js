const fs = require('fs');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const json = [];
const targetFolders = [
  '1. Bé kể mẹ nghe Mp3',
  '2. Nhạc thiếu nhi',
  '3. Thơ mầm non',
  '4. Truyện Cổ tích',
  '5. Truyện Thiếu nhi',
  '6. Góc sân và khoảng trời',
  '7. Kể chuyện và hát ru cho bé',
];
const mediaDir = 'media';
// delete media folder
fs.rmSync(mediaDir, { recursive: true });
// re-create media folder
fs.mkdirSync(mediaDir);

const mediaSourceDir = '../sach-hay-cho-be-original-audio'
const folders = fs.readdirSync(mediaSourceDir);

for (const folder of folders) {
  if (!targetFolders.includes(folder)) continue;
  const folderName = removeAccents(folder).replace('. ', '.').toLowerCase().replaceAll(' ', '-');
  fs.mkdirSync(`${mediaDir}/${folderName}`);
  const fileData = [];
  const files = fs.readdirSync( `${mediaSourceDir}/${folder}`);
  for (const f of files) {
    console.log(f);
    const file = f.replaceAll('-', ' ').replaceAll('_', ' ').replaceAll('.mp4', '');
    // get file extension
    const ext = file.split('.').slice(-1)[0];
    // get filename without extension
    const filenameWithoutExt = file.substring(0, file.length - ext.length - 1).replace(/\d+[.]/, '');
    // format display name
    const displayNameArr = [];
    // format file name
    const fileNameArr = [];
    const words = filenameWithoutExt.split(' ');
    for (const word of words) {
      if (!word) continue;
      fileNameArr.push(removeAccents(word.toLowerCase()));
      displayNameArr.push(capitalizeFirstLetter(word));
    }
    const displayName = displayNameArr.join(' ');
    const fileName = fileNameArr.join('-') + `.${ext}`;
    fileData.push({ displayName, fileName })
    fs.copyFileSync(`${mediaSourceDir}/${folder}/${f}`, `${mediaDir}/${folderName}/${fileName}`);
  }

  const folderData = {
    folderName,
    folderDisplayName: folder,
    fileData,
  };
  json.push(folderData);
}

fs.writeFileSync('media.json', JSON.stringify(json));
