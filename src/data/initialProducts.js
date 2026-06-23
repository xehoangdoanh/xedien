export const initialProducts = [
  {
    id: 'vinfast-feliz-s',
    name: 'VinFast Feliz S',
    type: 'emotorbike',
    brand: 'VinFast',
    price: 27000000,
    originalPrice: 29900000,
    priceMode: 'sale',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/4/4e/Newone_-_VinFast_Klara_S_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e0/Newone_-VinFast_Klara_S_red.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Newone_-_VinFast_Klara_cream.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/4c/Newone_-_Black_VinFast_Klara_scooter_w_lead_acid.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/dc/Newone_-_VinFast_Klara_S_Cargo_yellow.jpg'
    ],
    description: `VinFast Feliz S là dòng xe máy điện đô thị thời trang được VinFast nâng cấp toàn diện nhằm mang lại trải nghiệm di chuyển tối ưu nhất.\n\nVới ngôn ngữ thiết kế Ý thanh lịch, Feliz S toát lên vẻ sang trọng, tinh tế trong từng đường nét và cực kỳ tôn dáng người ngồi lái. Khung sườn chịu lực đầm chắc mang lại sự an tâm tuyệt đối.\n\nTrái tim của Feliz S là cụm pin công nghệ LFP tiên tiến, bền bỉ và tuyệt đối an toàn chống cháy nổ. Nhờ dung lượng pin 3.5 kWh lớn, xe đạt quãng đường di chuyển kỷ lục lên tới gần 200 km cho một lần sạc đầy, đáp ứng thoải mái nhu cầu đi lại cả tuần trong thành phố.\n\nBên cạnh đó, Feliz S được trang bị hàng loạt tiện ích cao cấp như hệ thống đèn Full LED định vị siêu sáng, cốp xe cực rộng dung tích 25 lít, và đặc biệt là chỉ số kháng nước toàn diện IP67. Xe có thể tự tin vận hành qua những cung đường ngập sâu tới 0.5 mét trong vòng 30 phút liên tục mà không gặp bất kỳ sự cố nào.`,
    specs: {
      battery: 'Pin LFP 3.5 kWh',
      batteryType: 'Pin sắt Lithium LFP tuổi thọ cao',
      range: '198 km / lần sạc',
      maxSpeed: '78 km/h',
      power: '3000 W (Công suất tối đa)',
      motorType: 'Động cơ Hub một chiều không chổi than',
      torque: '140 Nm',
      brakes: 'Phanh đĩa trước, Phanh cơ tang trống sau',
      tires: 'Lốp không săm Trước 90/90-12, Sau 120/70-12',
      waterproof: 'Tiêu chuẩn chống nước IP67',
      weight: '110 kg'
    },
    features: ['Cốp siêu rộng 25 Lít', 'Đèn pha Full LED projector siêu sáng', 'Chế độ lái Eco/Sport linh hoạt', 'Kết nối qua ứng dụng thông minh']
  },
  {
    id: 'yadea-odora-s8',
    name: 'Yadea Odora TTFar S8',
    type: 'emotorbike',
    brand: 'Yadea',
    price: 19500000,
    originalPrice: null,
    priceMode: 'normal',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/5/52/Unu_Electric_Scooter_red.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bd/Vespa_Elettrica_at_EICMA_2018_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/ab/2020_NIU_NQi_GT_electric_scooter.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/ec/2021_Super_Soco_CPx.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/69/2019_VESPA_ELETTRICA.jpg'
    ],
    description: `Yadea Odora TTFar S8 sở hữu thiết kế mang phong cách Ý cổ điển quý phái, là mẫu xe ga điện lý tưởng dành cho phái đẹp đô thị.\n\nCác đường nét bo tròn thanh thoát kết hợp lớp sơn tĩnh điện bóng bẩy mang lại vẻ ngoài kiêu sa, cuốn hút mọi ánh nhìn. Đèn LED đa sắc độc bản định hình thương hiệu Yadea nổi bật ở mặt trước.\n\nĐiểm độc đáo nhất trên Odora S8 là công nghệ thu hồi điện năng TTFar độc quyền của Yadea. Khi xe xuống dốc, phanh xe hoặc giảm ga xe, động cơ sẽ chuyển hóa động năng dư thừa thành điện năng để nạp ngược lại vào ắc quy, giúp gia tăng đáng kể quãng đường di chuyển và độ bền bỉ.\n\nTrang bị ắc quy Graphene thế hệ mới với tuổi thọ gấp 3 lần ắc quy thông thường cùng công nghệ chống nước toàn thân IPX6, xe cho phép bạn thoải mái di chuyển dưới những cơn mưa lớn đô thị mà không sợ hỏng hóc chập mạch.`,
    specs: {
      battery: 'Ắc quy Graphene TTFar 72V-22Ah',
      batteryType: 'Ắc quy Graphene độ bền gấp 3 lần thông thường',
      range: '101 km / lần sạc',
      maxSpeed: '45 km/h',
      power: '1500 W',
      motorType: 'Động cơ Hub TTFar độc quyền Yadea',
      torque: '85 Nm',
      brakes: 'Phanh đĩa trước, phanh tang trống sau',
      tires: 'Lốp không săm Graphene siêu chịu lực 90/90-10',
      waterproof: 'Kháng nước toàn xe IPX6',
      weight: '98 kg'
    },
    features: ['Màn hình hiển thị điện năng thông minh', 'Chìa khóa thông minh chống trộm 6 tính năng', 'Đèn LED định vị hình logo Yadea nổi bật', 'Chân chống trợ lực an toàn']
  },
  {
    id: 'honda-vision-2026',
    name: 'Honda Vision 2026 Đặc Biệt',
    type: 'motorbike',
    brand: 'Honda',
    price: null,
    originalPrice: null,
    priceMode: 'contact',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/dd/Honda_Vision_50_black.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/b/b8/Honda_Vision_110_front.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bf/Honda_Vision_110_rear.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/54/Honda_Vision_110_dashboard.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/c5/Honda_Vision_50_gray.JPG'
    ],
    description: `Honda Vision thế hệ mới tiếp tục khẳng định vị thế xe tay ga quốc dân hàng đầu tại thị trường Việt Nam.\n\nPhiên bản Đặc biệt sở hữu màu sơn đen nhám và xanh mờ cực kỳ trẻ trung và cá tính, kết hợp các chi tiết mạ chrome sắc sảo tạo nên diện mạo thời trang, năng động phù hợp với giới trẻ.\n\nXe được trang bị khối động cơ eSP 110cc phun xăng điện tử PGM-FI làm mát bằng không khí tích hợp bộ đề ACG siêu êm. Khung sườn dập hàn laser thế hệ mới eSAF của Honda giúp giảm trọng lượng toàn xe đáng kể trong khi tăng độ chịu lực, mang lại sự linh hoạt tối đa khi luồn lách qua các ngõ phố đông đúc.\n\nCác tiện ích hiện đại đi kèm bao gồm hệ thống khóa thông minh Smartkey an toàn cao, hộc đựng đồ phía trước có nắp đậy tích hợp sẵn cổng sạc USB tiện lợi cho phép sạc nhanh điện thoại khi đang di chuyển.`,
    specs: {
      engine: '110 cc, eSP thông minh',
      engineType: 'Động cơ xăng, 4 kỳ, 1 xi-lanh, làm mát bằng không khí',
      fuelConsumption: '1.87 lít / 100km',
      transmission: 'Vô cấp, tự động truyền động dây đai',
      torque: '9.29 Nm tại 5.250 vòng/phút',
      power: '8.8 HP (6.59 kW) tại 7.500 vòng/phút',
      brakes: 'Phanh đĩa trước kết hợp CBS, Phanh cơ sau',
      tires: 'Lốp không săm Trước 80/90-14, Sau 90/90-14',
      yHeight: '761 mm',
      tankCapacity: '4.9 Lít',
      weight: '97 kg'
    },
    features: ['Khóa Smartkey chống trộm', 'Hệ thống ngắt động cơ tạm thời Idling Stop', 'Hộp đựng đồ trước có nắp đậy tích hợp cổng sạc USB', 'Đèn trước luôn sáng an toàn']
  },
  {
    id: 'honda-sh-160i',
    name: 'Honda SH 160i Thể Thao',
    type: 'motorbike',
    brand: 'Honda',
    price: 105000000,
    originalPrice: null,
    priceMode: 'hidden',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/1/14/Honda_SH150i_2013.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Honda_SH300i_2009.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/61/Honda_SH125_2005.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Honda_SH125i_2017.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Honda_SH150_2009.jpg'
    ],
    description: `Honda SH 160i Thể Thao là chuẩn mực tối thượng của dòng xe ga cao cấp mang phong cách châu Âu thời thượng.\n\nSở hữu diện mạo uy nghi, mạnh mẽ với những đường nét góc cạnh thể thao, phiên bản màu xám xi-măng cực kỳ cá tính mang lại đẳng cấp hoàng gia độc bản cho chủ sở hữu trên mọi cung đường.\n\nSức mạnh của xe đến từ khối động cơ thế hệ mới eSP+ 4 van 156.9cc phun xăng điện tử, cho khả năng tăng tốc đột phá và êm ái vượt trội. Xe trang bị các công nghệ an toàn hàng đầu bao gồm hệ thống phanh chống bó cứng ABS hai kênh đắt giá và công nghệ kiểm soát lực kéo HSTC độc quyền giúp chống trượt bánh khi tăng ga đột ngột trên đường ướt trơn.\n\nNgoài ra, xe còn sở hữu mặt đồng hồ LCD thông minh hỗ trợ kết nối Bluetooth tới điện thoại qua app My Honda+, cốp xe siêu rộng dung tích 28 lít tích hợp cổng sạc USB, và nắp bình xăng bố trí phía trước thuận tiện sạc nhiên liệu mà không cần mở yên xe.`,
    specs: {
      engine: '156.9 cc, eSP+ 4 van',
      engineType: 'Động cơ xăng, 4 kỳ, xi-lanh đơn, làm mát bằng dung dịch',
      fuelConsumption: '2.24 lít / 100km',
      transmission: 'Vô cấp, truyền động tự động',
      torque: '14.8 Nm tại 6.500 vòng/phút',
      power: '16.6 HP (12.4 kW) tại 8.500 vòng/phút',
      brakes: 'Phanh đĩa cả 2 bánh, trang bị ABS 2 kênh',
      tires: 'Lốp không săm Trước 100/80-16, Sau 120/80-16',
      yHeight: '799 mm',
      tankCapacity: '7.8 Lít',
      weight: '133 kg'
    },
    features: ['Hệ thống kiểm soát lực kéo HSTC', 'Đồng hồ LCD kết nối Bluetooth (My Honda+)', 'Đèn Full LED cao cấp trước sau', 'Cổng sạc USB trong cốp xe rộng 28 Lít']
  },
  {
    id: 'pega-zinger-9',
    name: 'Pega Zinger 9',
    type: 'ebike',
    brand: 'Pega',
    price: 11900000,
    originalPrice: 12500000,
    priceMode: 'sale',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/df/E-bike_Flyer_C-Serie.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Yamaha_PAS_Babby_un_SP_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/87/Specialized_Turbo_Vado_3.0.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/50/E-Bike_Pedelec_Giant.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/07/Shimano_Alivio_Bicycle_Rear_Derailleur.jpg'
    ],
    description: `Pega Zinger 9 là mẫu xe đạp điện truyền thống vô cùng quen thuộc và được yêu thích nhờ độ bền vượt thời gian và khả năng tiết kiệm điện đột phá.\n\nXe có thiết kế nhỏ gọn, khung sườn thấp cực kỳ dễ điều khiển, phù hợp với các bạn học sinh đi học hàng ngày hoặc người lớn tuổi đi chợ, tập thể dục.\n\nKhung xe làm bằng hợp kim thép carbon siêu chịu lực theo tiêu chuẩn xuất khẩu Châu Âu, phủ ngoài bằng 5 lớp sơn tĩnh điện cao cấp mang lại vẻ ngoài luôn sáng đẹp bóng bẩy và chống rỉ sét hoàn toàn. Động cơ Bosch cao cấp tiết kiệm điện năng kết hợp ắc quy chuyên dụng giúp xe đi được quãng đường dài bền bỉ.\n\nTiện ích của xe vô cùng thân thiện bao gồm giỏ xe nhựa composite siêu dẻo bền bỉ trước xe, đồng hồ LCD hiển thị sắc nét dung lượng pin còn lại, giảm xóc lò xo kép chịu tải trọng lớn, và khóa cơ an toàn khóa bánh sau chống trộm.`,
    specs: {
      battery: 'Ắc quy 48V-12Ah (4 bình nhỏ)',
      batteryType: 'Ắc quy axit-chì kín khí chuyên dụng',
      range: '75 km / lần sạc',
      maxSpeed: '35 km/h',
      power: '350 W',
      motorType: 'Động cơ Hub không chổi than tiết kiệm điện',
      torque: '45 Nm',
      brakes: 'Phanh cơ tang trống trước và sau',
      tires: 'Lốp có săm bền bỉ kích thước 16 inch',
      waterproof: 'Chống nước tiêu chuẩn IPX5',
      weight: '40 kg'
    },
    features: ['Giỏ xe nhựa composite siêu dẻo bền bỉ', 'Đồng hồ điện tử LCD hiển thị mức pin', 'Khóa chống trộm khóa bánh sau cơ học', 'Giảm xóc lò xo kép chịu tải trọng 120kg']
  },
  {
    id: 'asama-eb-02',
    name: 'Asama EB-02',
    type: 'ebike',
    brand: 'Asama',
    price: 9800000,
    originalPrice: null,
    priceMode: 'normal',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/df/E-bike_Flyer_C-Serie.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/50/E-Bike_Pedelec_Giant.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/87/Specialized_Turbo_Vado_3.0.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Yamaha_PAS_Babby_un_SP_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/6f/Bicycle_gears_and_chain.jpg'
    ],
    description: `Xe đạp điện trợ lực Asama EB-02 sở hữu thiết kế sườn thấp tiện dụng, là người bạn đồng hành tuyệt vời cho mọi gia đình Việt.\n\nKhung sườn làm bằng thép cường lực chắc chắn, sơn phủ cao cấp chống oxy hóa tốt. Thiết kế yên xe bọc da êm ái hỗ trợ tăng giảm chiều cao linh hoạt theo vóc dáng.\n\nXe tích hợp động cơ trợ lực điện một chiều không chổi than ở bánh sau hỗ trợ lực đạp nhẹ nhàng, giúp bạn leo dốc hay di chuyển khi chở đồ nặng cực kỳ dễ dàng. Khi tắt điện xe vẫn hoạt động như một chiếc xe đạp thông thường nhờ cơ chế líp độc lập không bị cản lực.\n\nCác trang bị tiêu chuẩn của xe bao gồm rổ kim loại tiện lợi phía trước, hệ thống đèn pha LED sáng rõ lấy điện trực tiếp từ nguồn ắc quy, yên xe sau có tựa lưng bọc nệm và chân chống chịu lực vững chãi.`,
    specs: {
      battery: 'Ắc quy 48V-12Ah',
      batteryType: 'Ắc quy axit-chì',
      range: '50 km / lần sạc trợ lực',
      maxSpeed: '30 km/h',
      power: '250 W',
      motorType: 'Động cơ trợ lực điện một chiều không chổi than',
      torque: '30 Nm',
      brakes: 'Phanh cơ chữ V trước, phanh đùm sau',
      tires: 'Bánh xe 22 inch lốp Kenda chất lượng',
      waterproof: 'Tiêu chuẩn kháng ẩm nhẹ',
      weight: '38 kg'
    },
    features: ['Hỗ trợ cả bàn đạp và tay ga linh hoạt', 'Yên xe bọc da êm ái, điều chỉnh được chiều cao', 'Đèn LED trước siêu sáng tự động lấy nguồn ắc quy', 'Rổ xe kim loại sơn chống rỉ']
  },
  {
    id: 'giant-escape-2-2026',
    name: 'Xe đạp đường phố Giant Escape 2',
    type: 'bicycle',
    brand: 'Giant',
    price: 10200000,
    originalPrice: null,
    priceMode: 'normal',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/b/b5/City_bike_in_Prague.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/41/Left_side_of_Roadmaster_classic_bicycle.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Cruiser_bicycle_side_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/3/30/Bicycle_derailleur_rear_shimano.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/f/fe/Bicycle_brake_handle_on_handlebars.jpg'
    ],
    description: `Giant Escape 2 là dòng xe đạp đường phố (Touring/Hybrid) trứ danh từ Giant - thương hiệu xe đạp số 1 thế giới.\n\nSở hữu thiết kế thanh thoát, năng động với khung sườn bằng hợp kim nhôm ALUXX siêu nhẹ bền bỉ chống gỉ sét tối đa. Toàn bộ dây cáp được đi âm sườn cực kỳ thẩm mỹ, gọn gàng và tránh bám bụi bẩn.\n\nXe được trang bị bộ chuyển động Shimano Tourney 21 tốc độ (3 đĩa x 7 líp) cao cấp giúp chuyển líp đĩa mượt mà, hỗ trợ tối đa lực đạp khi đi đường bằng cũng như leo dốc nhẹ đô thị. Hệ thống phanh đĩa cơ học Tektro mang lại lực phanh ổn định, an toàn ngay cả dưới trời mưa ẩm ướt.\n\nLốp xe Giant Escape chuyên dụng với kích thước 700x38c bám đường tốt, kháng đinh dăm hiệu quả giúp những hành trình của bạn trở nên êm ái và an tâm tuyệt đối.`,
    specs: {
      frame: 'Hợp kim nhôm ALUXX siêu nhẹ công nghệ Giant',
      fork: 'Phuộc đơ hợp kim nhôm chịu lực cao',
      groupset: 'Shimano Tourney 3 đĩa x 7 líp (21 Tốc độ)',
      brakes: 'Phanh đĩa cơ học Tektro tản nhiệt tốt',
      tires: 'Lốp kháng đinh Giant Escape 700x38c bám đường tốt',
      weight: '12.5 kg'
    },
    features: ['Khung sườn bảo hành trọn đời', 'Thiết kế dây đi âm sườn thẩm mỹ sạch sẽ', 'Yên xe Giant Sport êm ái thiết kế công thái học', 'Tích hợp sẵn ngàm gắn baga và chắn bùn']
  }
];

export const popularImporterBikes = [
  {
    id: 'honda-lead-2026',
    name: 'Honda Lead 125cc',
    type: 'motorbike',
    brand: 'Honda',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Honda_Lead125_pearl_spicula_pink.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/d7/Honda_SCV100_Lead_Scooter.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/95/Honda_Lead_110_Front.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/5/5a/Honda_lead_125.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/a/ad/Honda_lead_back_large.JPG'
    ],
    description: `Honda Lead 125cc thế hệ mới là đỉnh cao của sự tiện ích đô thị dành cho gia đình Việt.\n\nSở hữu thiết kế thanh lịch sang trọng, Lead nổi tiếng với cốp xe siêu khủng dung tích lên tới 37 Lít dưới yên xe, cho phép đựng vừa 2 chiếc mũ bảo hiểm full-face cùng vô số vật dụng cá nhân lớn của cả gia đình.\n\nTrái tim của xe là động cơ thông minh thế hệ mới eSP+ 4 van 125cc làm mát bằng dung dịch. Xe hoạt động cực kỳ êm ái, tăng tốc nhạy bén và tối ưu hóa lượng nhiên liệu tiêu thụ ở mức thấp nhất phân khúc.\n\nCác tiện ích đi kèm vô cùng phong phú bao gồm hệ thống khóa thông minh Smartkey đa năng, cổng sạc USB ở hộc đựng đồ phía trước rất tiện lợi để sạc điện thoại khi lái xe, và nắp bình xăng đặt ngoài giúp tiếp nhiên liệu nhanh chóng mà không cần xuống xe mở yên.`,
    specs: {
      engine: '124.8 cc, eSP+ 4 van',
      engineType: 'Xăng, 4 kỳ, xi-lanh đơn, làm mát bằng chất lỏng',
      fuelConsumption: '2.16 lít / 100km',
      transmission: 'Vô cấp, truyền động tự động',
      torque: '11.4 Nm tại 5.000 vòng/phút',
      power: '11 HP (8.2 kW) tại 8.500 vòng/phút',
      brakes: 'Phanh đĩa trước, Phanh tang trống sau',
      tires: 'Lốp không săm Trước 90/90-12, Sau 100/90-10',
      yHeight: '760 mm',
      tankCapacity: '6.0 Lít',
      weight: '113 kg'
    },
    features: ['Cốp siêu rộng 37L lớn nhất phân khúc', 'Khóa thông minh Smartkey thế hệ mới', 'Hệ thống ngắt động cơ tạm thời Idling Stop', 'Cổng sạc sạc USB tiện lợi phía trước']
  },
  {
    id: 'vinfast-evo200-lite',
    name: 'VinFast Evo200 Lite',
    type: 'emotorbike',
    brand: 'VinFast',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/4/4e/Newone_-_VinFast_Klara_S_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e0/Newone_-VinFast_Klara_S_red.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Newone_-_VinFast_Klara_cream.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/4c/Newone_-_Black_VinFast_Klara_scooter_w_lead_acid.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/dc/Newone_-_VinFast_Klara_S_Cargo_yellow.jpg'
    ],
    description: `VinFast Evo200 Lite là mẫu xe máy điện đô thị thời thượng được VinFast thiết kế dành riêng cho thế hệ học sinh, sinh viên năng động.\n\nVới giới hạn vận tốc an toàn 49 km/h, các bạn trẻ có thể tự tin vận hành xe hàng ngày đi học, đi chơi mà không yêu cầu bằng lái xe. Thiết kế nhỏ gọn, thời trang phong cách Châu Âu giúp xe di chuyển cực kỳ năng động qua các cung đường hẹp.\n\nSử dụng cụm pin LFP thế hệ mới siêu bền, Evo200 Lite mang lại hành trình bứt phá lên tới hơn 200 km sau mỗi lần sạc đầy (ở điều kiện tốc độ trung bình 30km/h). Xe đạt chỉ số kháng nước tối đa IP67 cho cả động cơ và pin, cho phép thoải mái rửa xe hoặc đi qua những vùng ngập lụt sâu đô thị.\n\nCốp xe rộng rãi dung tích 22 Lít tiện lợi chứa mũ bảo hiểm, sách vở và đồ dùng cá nhân, kết hợp đèn chiếu sáng Full LED thông minh nâng tầm an toàn ban đêm.`,
    specs: {
      battery: 'Pin LFP 3.5 kWh',
      batteryType: 'Pin sắt Lithium LFP an toàn chống cháy nổ',
      range: '205 km / lần sạc',
      maxSpeed: '49 km/h (An toàn không cần bằng lái)',
      power: '1500 W (Công suất danh định)',
      motorType: 'Động cơ Hub tích hợp bánh sau',
      torque: '70 Nm',
      brakes: 'Phanh đĩa trước, Phanh đĩa sau',
      tires: 'Lốp không săm 90/90-12 trước sau',
      waterproof: 'Kháng nước vượt trội tiêu chuẩn IP67',
      weight: '97 kg'
    },
    features: ['Không yêu cầu bằng lái xe', 'Kháng nước sâu 0.5m trong 30 phút', 'Đèn LED tròn phong cách Châu Âu cổ điển', 'Cốp xe chứa đồ 22 Lít tiện lợi']
  },
  {
    id: 'yadea-voltguard-v002',
    name: 'Yadea Voltguard V002',
    type: 'emotorbike',
    brand: 'Yadea',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/a/ab/2020_NIU_NQi_GT_electric_scooter.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/ec/2021_Super_Soco_CPx.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/f/fe/Super_Soco_TC_Max_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bd/Vespa_Elettrica_at_EICMA_2018_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/d/d0/E-Roller_Emco_NOVI_C_1500_Miku_Max.jpg'
    ],
    description: `Yadea Voltguard V002 là dòng xe máy điện thể thao mạnh mẽ với bánh xe kích thước lớn 14 inch mang lại trải nghiệm lái cực kỳ đầm chắc và ổn định trên mọi địa hình.\n\nĐộng cơ siêu khỏe 3000W kết hợp pin Lithium cao cấp cho vận tốc tối đa 80km/h.\n\nThiết kế xe mang tính khí động học cao cùng hệ thống đèn pha Full LED đôi sắc nét bứt phá mọi bóng tối. Hệ thống giảm xóc thủy lực trước sau kết hợp yên xe bọc da thể thao mang lại tư thế ngồi thoải mái trên những cung đường xa.\n\nXe trang bị phanh đĩa CBS cả hai bánh trước sau giúp phân bổ lực phanh đồng đều, giảm thiểu trượt bánh khi phanh gấp. Màn hình màu LCD hiện đại hiển thị chi tiết phần trăm pin, tốc độ và chế độ lái thời gian thực.`,
    specs: {
      battery: 'Pin Lithium 72V-38Ah',
      batteryType: 'Pin Lithium cao cấp sạc nhanh',
      range: '120 km / lần sạc',
      maxSpeed: '80 km/h',
      power: '3000 W',
      motorType: 'Động cơ Hub công suất cao',
      torque: '120 Nm',
      brakes: 'Phanh đĩa CBS liên kết cả 2 bánh',
      tires: 'Lốp thể thao bánh lớn 14 inch bám đường tốt',
      waterproof: 'Đạt chuẩn kháng nước IPX7',
      weight: '120 kg'
    },
    features: ['Hệ thống phanh đĩa CBS an toàn chống trượt', 'Phuộc ống lồng trước và giảm xóc thủy lực sau', 'Động cơ siêu khỏe tăng tốc từ 0-50km/h chỉ 4.5 giây', 'Màn hình màu LCD hiển thị sắc nét']
  },
  {
    id: 'asama-joy-2026',
    name: 'Asama Joy EB-04',
    type: 'ebike',
    brand: 'Asama',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/df/E-bike_Flyer_C-Serie.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Yamaha_PAS_Babby_un_SP_2020.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/87/Specialized_Turbo_Vado_3.0.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/50/E-Bike_Pedelec_Giant.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/6f/Bicycle_gears_and_chain.jpg'
    ],
    description: `Asama Joy EB-04 là sự kết hợp hoàn hảo giữa xe đạp gấp thể thao và xe đạp điện trợ lực đô thị năng động.\n\nThiết kế khung sườn bằng hợp kim nhôm AL6061 siêu nhẹ cho phép gấp gọn nhanh chóng chỉ trong 15 giây, vô cùng tiện lợi để mang lên chung cư, tàu điện trên cao hoặc xếp gọn trong cốp xe ô tô đi dã ngoại.\n\nPin Lithium-ion cao cấp của Samsung được ẩn tinh tế hoàn toàn trong sườn xe, bảo vệ pin khỏi mưa nắng bụi bẩn và có khóa chống trộm an toàn. Bạn có thể dễ dàng cắm sạc trực tiếp trên xe hoặc mở khóa tháo rời pin đem sạc rời tiện dụng.\n\nCảm biến lực đạp thông minh đo nhịp độ và tự động kích hoạt lực trợ lực từ động cơ điện giúp mỗi vòng quay bàn đạp của bạn trở nên vô cùng nhẹ nhàng, bay bổng.`,
    specs: {
      battery: 'Pin Lithium-ion 36V-10.4Ah',
      batteryType: 'Pin Lithium-ion Samsung cao cấp',
      range: '65 km / lần sạc trợ lực',
      maxSpeed: '25 km/h',
      power: '250 W',
      motorType: 'Động cơ trợ lực điện không chổi than bánh sau',
      torque: '35 Nm',
      brakes: 'Phanh đĩa cơ học trước và sau',
      tires: 'Lốp bánh béo bám đường 20 x 2.125 inch',
      waterproof: 'Kháng nước IPX5',
      weight: '24 kg'
    },
    features: ['Khung nhôm AL6061 gấp gọn nhanh trong 15 giây', 'Cảm biến trợ lực thông minh theo nhịp đạp', 'Pin giấu kín chống trộm có khóa bảo vệ', 'Đèn pha LED sáng rõ ban đêm']
  }
];
