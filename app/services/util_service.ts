export class UtilService {
  static generateRandomNickname(): string {
    const prefixes = [
      "멋진", "든든한", "귀여운", "강력한", "재빠른", "화려한", "용감한", "현명한", "활기찬", "유쾌한",
    ];
    const suffixes = [
      "고래밥", "사자", "호랑이", "독수리", "고양이", "강아지", "여우", "팬더", "토끼", "공룡",
    ];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${randomPrefix} ${randomSuffix}`;
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}