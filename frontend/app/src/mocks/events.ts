import { http, HttpResponse } from "msw"

export const eventsHandlers = [
  http.get("/api/events", () => {
    return HttpResponse.json(
      ([
        {
          title: "常陸国YOSAKOI祭り",
          area: "茨城県",
          startDate: "2025-05-17",
          endDate: "2025-05-18",
          description: "地獄の幕開け。基本的に毎年クソ暑く、無限石段の往復、演舞会場の複雑さなどトラップが多く、初見殺し"
        },
        {
          title: "うつくしまYOSAKOIまつり",
          area: "福島県",
          startDate: "2025-09-01",
          endDate: "2025-09-02",
          description: "地獄に慣れたはじめたころ。待ちに待ったお披露目の舞台だが、不幸にもだいぶ過疎っており、盛り上がりに欠けるかもしれない"
        },
        {
          title: "仙台みちのくYOSAKOIまつり",
          area: "宮城県",
          startDate: "2025-10-11",
          endDate: "2025-10-12",
          description: "説明不要の地獄のお祭り。長距離運転、睡眠不足、祭りの疲労などで2日目はゾンビ化する。ゾンビのまま夜中まで踊ったりする"
        }
      ])
    )
  })
]
