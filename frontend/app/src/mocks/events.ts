import { http, HttpResponse } from "msw"

const eventsData = [
  {
    id: "hitachinokuni-yosakoi",
    title: "常陸国YOSAKOI祭り",
    area: "茨城県",
    startDate: "2025-05-17",
    endDate: "2025-05-18",
    description: "地獄の幕開け。基本的に毎年クソ暑く、無限石段の往復、演舞会場の複雑さなどトラップが多く、初見殺し",
    teamCount: 180,
    nearestStation: "JR常陸太田駅 シャトルバス15分",
    parking: "臨時駐車場あり（無料・会場まで徒歩10分）",
    contact: "常陸国YOSAKOI祭り実行委員会 TEL: 0294-72-3111",
    additionalInfo: "メイン会場は観客が多くて緊張しますが、袋田会場はよさこいを見に来ているのか、袋田の滝を見に行くついでに寄ったのかわからない人が多い。年度初めなので先輩は後輩に気を使い、後輩も先輩に気を使うという誰も徳をしない状況が二日間続く。大会で入賞したのに食べ歩きをしてて気が付かなかった伝説のチームがあったとか・・・。ちなみに関係ないが、その次の日の講義で寝ている髪の毛の色が変なやつは絶対によさこい部"
  },
  {
    id: "utsukushima-yosakoi",
    title: "うつくしまYOSAKOIまつり",
    area: "福島県",
    startDate: "2025-09-01",
    endDate: "2025-09-02",
    description: "地獄に慣れたはじめたころ。待ちに待ったお披露目の舞台だが、不幸にもだいぶ過疎っており、盛り上がりに欠けるかもしれない",
    teamCount: 120,
    nearestStation: "JR福島駅 徒歩20分",
    parking: "市営駐車場利用（有料・1日500円）",
    contact: "うつくしまYOSAKOIまつり実行委員会 TEL: 024-525-3722",
    additionalInfo: "合宿後で開始前から疲れている祭り。施設にお風呂があるから入りたいが、グッと堪えて踊ることになる。確かもうなくなった。"
  },
  {
    id: "sendai-michinoku-yosakoi",
    title: "仙台みちのくYOSAKOIまつり",
    area: "宮城県",
    startDate: "2025-10-11",
    endDate: "2025-10-12",
    description: "説明不要の地獄のお祭り。長距離運転、睡眠不足、祭りの疲労などで2日目はゾンビ化する。ゾンビのまま夜中まで踊ったりする",
    teamCount: 250,
    nearestStation: "JR仙台駅 地下鉄・バス利用で15分",
    parking: "周辺有料駐車場を利用（1時間200円程度）",
    contact: "仙台みちのくYOSAKOIまつり実行委員会 TEL: 022-268-6251",
    additionalInfo: "牛タンが美味しいので、13時から映画→牛タン→高みの見物で祭りを見る流れがベスト。宿泊施設の敷布団はダニがいるので、シーツを敷かないと痒くなるので注意"
  }
]

export const eventsHandlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(eventsData)
  }),
  
  http.get("/api/events/:id", ({ params }) => {
    const { id } = params
    const event = eventsData.find(event => event.id === id)
    
    if (!event) {
      return HttpResponse.json({ error: "Event not found" }, { status: 404 })
    }
    
    return HttpResponse.json(event)
  })
]
