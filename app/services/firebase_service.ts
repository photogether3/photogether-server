
export class FirebaseStorageService {

  // /**
  //  * @todo 파이어베이스 스토리지에 파일을 저장합니다.
  //  * @warning 파일들은 기본적으로 '공개' 상태로 저장됩니다.
  //  * @throw 파이어베이스 장애 발생시 500 에러처리합니다.
  //  */
  // static async upload(filePath: string, multpart: Multipart) {
  //   multpart.onFile('file', {}, async (file) => {
  //     const bucket = firebaseStorage.bucket(firebaseBucket)
  //     const firebaseFile = bucket.file(filePath)
  //     console.log(firebaseFile)
  //     // Firebase Storage에 업로드를 위한 WriteStream 생성
  //     const writeStream = firebaseFile.createWriteStream()

  //     const fileRef = bucket.file(filePath);
  //     await fileRef.save(file, {
  //         contentType: file.mimetype,
  //     });
  //     await fileRef.makePublic();

  //     // 업로드 완료 후, 파일을 공개 처리
  //     await firebaseFile.makePublic()
  //   })

}
