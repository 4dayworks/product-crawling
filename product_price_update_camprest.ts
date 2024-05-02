import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByCampProduct } from "./camp/functions/all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const productSelectedList: number[] = [
  // 5177,
  // 1111 (우리꺼 없는거 !)
  // 5166, 5167, 5169, 5174, 5175, 5177, 5184, 5185, 5186, 5187, 5188, 5189, 5200, 5201, 5202, 5203, 5204, 5205, 5208,
  // 5210, 5211, 5231, 5234, 5240, 5242, 5243, 5244, 5245, 5247, 5252, 5258, 5259, 5261, 5264, 5265, 5268, 5271, 5287,
  // 5291, 5292, 5293, 5296, 5298, 5301, 5308, 5309, 5310, 5322, 5326, 5327, 5328, 5330, 5333, 5334, 5335, 5342, 5349,
  // 5350, 5351, 5352, 5354, 5355, 5356, 5357, 5358, 5359, 5360, 5363, 5365, 5366, 5369, 5374, 5377, 5378, 5379, 5380,
  // 5386, 5387, 5502, 5503, 5504, 5579, 5582, 5593, 5605, 5606, 5607, 5618, 5620, 5622, 5623, 5625, 5626, 5627, 5654,
  // 5655, 5656, 5657, 5658, 5659, 5660, 5661, 5667, 5670, 5671, 5672, 5676, 5699, 5703, 5704, 5706, 5709, 5712, 5718,
  // 5719, 5729, 5730, 5731, 5732, 5735, 5738, 5739, 5740, 5742, 5744, 5745, 5750, 5759, 5761, 5762, 5763, 5784, 5786,
  // 5787, 5788, 5797, 5803, 5805, 5806, 5808, 5809, 5810, 5814, 5816, 5819, 5823, 5824, 5825, 5827, 5828, 5831, 5832,
  // 5837, 5843, 5847, 5851, 5854, 5855, 5859, 5861, 5865, 5866, 5869, 5871, 5873, 5876, 5879, 5880, 5886, 5910, 5911,
  // 5913, 5915, 5917, 5920, 5922, 5924, 5929, 5931, 5932, 5934, 5935, 5936, 5940, 5942, 5943, 5946, 5952, 5954, 5955,
  // 5956, 5958, 5962, 5963, 5964, 5965, 5966, 5969, 5970, 5971, 5974, 5979, 5980, 5981, 5983, 5984, 5985, 5989, 5992,
  // 5996, 5999, 6001, 6004, 6005, 6006, 6007, 6008, 7228, 7229, 7230, 7231, 7232, 7233, 7244, 7245, 7418, 7419, 7420,
  // 7421, 7422, 7423, 7424, 7425, 7426, 7427, 7428, 7429, 7447, 7448, 7449, 7450, 7451, 7452, 7453, 7454, 7455, 7456,
  // 7457, 7458, 7459, 7460, 7461, 7462, 7463, 7464, 7465, 7466, 7501, 7502, 7503, 7504, 7505, 7506, 7507, 7508, 7509,
  // 7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7520, 7521, 7522, 7523, 7524, 7525, 7526, 7527, 7528,
  // 7529, 7530, 7531, 7532, 7675, 7676, 7677, 7678, 7679, 7725, 7726, 7729, 7730, 7731, 7732, 7733, 7734, 8407, 8408,
  // 8409, 8530, 8531, 8532, 8533, 8534, 8535, 8536, 8537, 8538, 8539, 8541, 8591, 8592, 8873, 8874, 8875, 8876, 8879,
  // 8880, 8882, 8893, 8894, 8902, 8903, 8904, 8905, 8906, 8907, 8908, 8909, 9035, 9036, 9158, 9160, 9282, 9329, 9330,
  // 9331, 9332, 9369, 9589, 9590, 9599, 9638, 9639, 9641, 9642,
  // 2222 (우리꺼 있는거 !)
  // 101, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 134, 137, 138, 139, 141, 142,
  // 143, 144, 146, 147, 149, 150, 151, 154, 155, 157, 158, 160, 162, 163, 165, 167, 168, 169, 170, 172, 173, 174, 175,
  // 176, 177, 178, 179, 180, 181, 182, 184, 185, 186, 187, 189, 190, 191, 192, 193, 194, 195, 196, 197, 199, 205, 209,
  // 211, 212, 213, 214, 215, 216, 222, 223, 224, 225, 232, 233, 240, 241, 245, 247, 250, 254, 255, 257, 264, 280, 283,
  // 284, 287, 297, 298, 300, 311, 314, 316, 317, 318, 319, 320, 321, 323, 324, 325, 327, 328, 329, 331, 332, 333, 334,
  // 335, 336, 338, 342, 343, 344, 346, 347, 348, 350, 352, 354, 356, 357, 359, 360, 361, 362, 363, 364, 365, 367, 369,
  // 370, 371, 372, 374, 377, 378, 379, 381, 382, 383, 386, 387, 389, 390, 392, 394, 395, 396, 398, 399, 402, 403, 404,
  // 410, 413, 417, 419, 421, 423, 427, 432, 433, 436, 438, 439, 442, 444, 445, 446, 447, 448, 449, 450, 451, 452, 454,
  // 455, 457, 458, 459, 462, 463, 464, 465, 466, 467, 472, 474, 477, 479, 481, 484, 485, 486, 487, 493, 495, 496, 497,
  // 498, 499,
  // 위에껀 기존꺼
  // 5013, 5014, 5015, 5016, 5017, 5018, 5019, 5020, 5021, 5022, 5023, 5024, 5025, 5026, 5027, 5028, 5029, 5030, 5031,
  // 5032, 5033, 5034, 5035, 5036, 5037, 5040, 5041, 5043, 5044, 5045, 5046, 5048, 5049, 5050, 5051, 5053, 5056, 5057,
  5058, 5059, 5060, 5061, 5062, 5063, 5064, 5065, 5066, 5067, 5069, 5070, 5071, 5072, 5073, 5074, 5076, 5078, 5080,
  5082, 5086, 5088, 5091, 5092, 5093, 5096, 5097, 5099, 5100, 5101, 5102, 5104, 5105, 5107, 5108, 5109, 5112, 5113,
  5116, 5117, 5118, 5120, 5121, 5122, 5123, 5125, 5126, 5127, 5128, 5130, 5132, 5133, 5134, 5135, 5136, 5138, 5141,
  5143, 5145, 5146, 5147, 5148, 5149, 5150, 5151, 5152, 5153, 5154, 5155, 5158, 5159, 5161, 5165, 5176, 5180, 5181,
  5193, 5197, 5198, 5206, 5212, 5213, 5214, 5215, 5216, 5217, 5218, 5219, 5220, 5221, 5222, 5223, 5224, 5225, 5226,
  5227, 5228, 5233, 5236, 5237, 5238, 5241, 5246, 5248, 5249, 5250, 5251, 5253, 5254, 5255, 5257, 5262, 5263, 5266,
  5267, 5269, 5270, 5272, 5273, 5274, 5275, 5276, 5277, 5278, 5280, 5282, 5284, 5285, 5286, 5297, 5300, 5302, 5303,
  5305, 5307, 5311, 5312, 5314, 5315, 5316, 5317, 5318, 5319, 5320, 5321, 5324, 5325, 5329, 5332, 5337, 5338, 5339,
  5343, 5345, 5346, 5347, 5348, 5371, 5373, 5382, 5383, 5384, 5385, 5388, 5392, 5393, 5395, 5397, 5398, 5399, 5403,
  5404, 5405, 5406, 5407, 5409, 5410, 5411, 5412, 5413, 5414, 5415, 5418, 5419, 5421, 5422, 5429, 5430, 5431, 5436,
  5440, 5442, 5443, 5444, 5445, 5446, 5447, 5455, 5457, 5458, 5462, 5465, 5466, 5475, 5476, 5478, 5479, 5480, 5481,
  5484, 5485, 5487, 5490, 5491, 5492, 5493, 5494, 5495, 5496, 5497, 5498, 5499, 5500, 5501, 5510, 5511, 5512, 5513,
  5514, 5515, 5516, 5517, 5518, 5519, 5520, 5521, 5524, 5532, 5533, 5539, 5540, 5541, 5543, 5544, 5546, 5548, 5551,
  5553, 5555, 5556, 5557, 5558, 5563, 5565, 5566, 5568, 5572, 5578, 5581, 5583, 5584, 5585, 5586, 5587, 5588, 5598,
  5599, 5602, 5615, 5616, 5619, 5629, 5630, 5631, 5633, 5634, 5638, 5640, 5641, 5642, 5645, 5648, 5649, 5653, 5664,
  5665, 5669, 5673, 5674, 5675, 5680, 5681, 5683, 5686, 5689, 5690, 5693, 5695, 5696, 5698, 5708, 5713, 5714, 5715,
  5716, 5717, 5720, 5721, 5723, 5726, 5733, 5737, 5743, 5746, 5747, 5751, 5752, 5753, 5754, 5760, 5765, 5766, 5767,
  5768, 5770, 5772, 5774, 5775, 5777, 5783, 5789, 5793, 5794, 5795, 5796, 5799, 5800, 5811, 5812, 5813, 5815, 5821,
  5829, 5836, 5840, 5841, 5844, 5848, 5849, 5850, 5852, 5856, 5857, 5858, 5862, 5863, 5874, 5877, 5878, 5881, 5882,
  5883, 5884, 5887, 5888, 5889, 5890, 5892, 5893, 5894, 5896, 5897, 5899, 5900, 5901, 5902, 5903, 5904, 5905, 5906,
  5907, 5908, 5909, 5912, 5914, 5916, 5918, 5919, 5921, 5923, 5925, 5926, 5927, 5928, 5930, 5933, 5937, 5938, 5939,
  5941, 5944, 5945, 5947, 5948, 5949, 5950, 5951, 5953, 5957, 5959, 5960, 5961, 5967, 5968, 5972, 5973, 5975, 5976,
  5977, 5978, 5982, 5986, 5987, 5988, 5990, 5991, 5993, 5994, 5995, 5997, 5998, 6000, 6002, 6003, 6009, 6010, 6011,
  6012, 6013, 6015, 6016, 6017, 6018, 6019, 6020, 6021, 6022, 6027, 6028, 6029, 6030, 6031, 6032, 6033, 6034, 6035,
  6036, 6037, 6038, 6040, 6041, 6042, 6043, 6044, 6045, 6046, 6049, 6050, 6051, 6052, 6053, 6054, 6055, 6056, 6057,
  6058, 6059, 6060, 6061, 6062, 6063, 6066, 6068, 6072, 6074, 6075, 6076, 6078, 6079, 6081, 6082, 6083, 6084, 6086,
  6087, 6088, 6089, 6090, 6091, 6092, 6093, 6094, 6095, 6096, 6098, 6100, 6101, 6102, 6104, 6105, 6108, 6109, 6110,
  6111, 6113, 6114, 6115, 6116, 6118, 6122, 6124, 6126, 6127, 6129, 6130, 6131, 6132, 6133, 6135, 6136, 6137, 6138,
  6140, 6141, 6142, 6143, 6144, 6145, 6146, 6147, 6148, 6150, 6152, 6153, 6154, 6155, 6156, 6157, 6158, 6159, 6162,
  6163, 6164, 6166, 6167, 6168, 6170, 6172, 6173, 6175, 6176, 6177, 6178, 6179, 6181, 6182, 6188, 6190, 6193, 6194,
  6195, 6198, 6200, 6201, 6202, 6203, 6205, 6206, 6207, 6208, 6209, 6210, 6211, 6214, 6216, 6217, 6218, 6220, 6221,
  6223, 6224, 6225, 6227, 6228, 6230, 6231, 6232, 6236, 6237, 6238, 6239, 6240, 6242, 6246, 6248, 6251, 6254, 6256,
  6257, 6262, 6264, 6265, 6267, 6279, 6280, 6282, 6283, 6285, 6286, 6287, 6292, 6295, 6297, 6299, 6300, 6301, 6303,
  6305, 6312, 6314, 6316, 6320, 6321, 6322, 6323, 6324, 6330, 6334, 6335, 6336, 6337, 6340, 6342, 6344, 6354, 6355,
  6356, 6359, 6360, 6362, 6363, 6367, 6369, 6372, 6373, 6375, 6377, 6378, 6382, 6383, 6384, 6385, 6388, 6390, 6391,
  6393, 6394, 6395, 6397, 6398, 6399, 6400, 6402, 6403, 6406, 6407, 6410, 6415, 6416, 6417, 6419, 6421, 6422, 6423,
  6426, 6429, 6431, 6433, 6434, 6436, 6439, 6441, 6443, 6447, 6448, 6449, 6451, 6454, 6455, 6456, 6457, 6458, 6460,
  6465, 6466, 6468, 6469, 6471, 6472, 6473, 6475, 6476, 6480, 6481, 6483, 6486, 6487, 6488, 6490, 6493, 6495, 6496,
  6507, 6509, 6511, 6512, 6515, 6517, 6519, 6522, 6524, 6526, 6530, 6531, 6534, 6536, 6538, 6539, 6541, 6542, 6543,
  6544, 6545, 6546, 6547, 6548, 6549, 6550, 6551, 6552, 6556, 6557, 6558, 6559, 6560, 6565, 6566, 6567, 6570, 6578,
  6579, 6580, 6585, 6586, 6587, 6589, 6598, 6599, 6601, 6606, 6607, 6610, 6611, 6612, 6613, 6614, 6617, 6627, 6628,
  6632, 6633, 6636, 6641, 6646, 6648, 6650, 6654, 6666, 6667, 6669, 6672, 6674, 6676, 6678, 6680, 6682, 6683, 6684,
  6686, 6688, 6689, 6690, 6691, 6692, 6694, 6695, 6696, 6703, 6705, 6707, 6709, 6711, 6714, 6718, 6719, 6720, 6721,
  6728, 6729, 6732, 6736, 6743, 6749, 6981, 6982, 6984, 6987, 6988, 6989, 6991, 6992, 6993, 6996, 6999, 7000, 7002,
  7015, 7025, 7035, 7036, 7037, 7038, 7040, 7041, 7042, 7043, 7044, 7045, 7046, 7049, 7050, 7051, 7052, 7054, 7056,
  7057, 7058, 7059, 7060, 7063, 7065, 7067, 7068, 7069, 7070, 7071, 7074, 7077, 7080, 7081, 7087, 7088, 7089, 7090,
  7092, 7093, 7096, 7097, 7098, 7099, 7101, 7102, 7104, 7105, 7106, 7107, 7109, 7110, 7111, 7112, 7113, 7115, 7116,
  7118, 7119, 7120, 7121, 7123, 7124, 7125, 7127, 7130, 7133, 7134, 7135, 7138, 7139, 7142, 7143, 7144, 7146, 7147,
  7148, 7149, 7151, 7153, 7154, 7155, 7156, 7157, 7158, 7162, 7167, 7168, 7169, 7170, 7171, 7172, 7173, 7207, 7214,
  7215, 7216, 7217, 7218, 7220, 7221, 7234, 7236, 7237, 7238, 7239, 7248, 7249, 7250, 7251, 7272, 7275, 7278, 7279,
  7281, 7282, 7287, 7288, 7289, 7324, 7329, 7330, 7331, 7332, 7333, 7334, 7335, 7336, 7337, 7338, 7339, 7340, 7341,
  7342, 7343, 7345, 7346, 7347, 7348, 7349, 7350, 7351, 7352, 7353, 7354, 7355, 7356, 7357, 7358, 7359, 7360, 7361,
  7362, 7363, 7364, 7365, 7366, 7367, 7368, 7369, 7370, 7371, 7372, 7373, 7374, 7375, 7376, 7377, 7378, 7379, 7380,
  7381, 7382, 7383, 7384, 7385, 7386, 7387, 7388, 7389, 7390, 7391, 7392, 7393, 7394, 7395, 7396, 7397, 7398, 7399,
  7400, 7401, 7402, 7403, 7404, 7405, 7406, 7407, 7408, 7409, 7410, 7411, 7412, 7413, 7414, 7415, 7416, 7417, 7430,
  7431, 7432, 7433, 7434, 7435, 7436, 7437, 7438, 7439, 7440, 7441, 7442, 7443, 7444, 7445, 7446, 7467, 7468, 7469,
  7470, 7471, 7472, 7473, 7474, 7475, 7476, 7477, 7478, 7479, 7480, 7481, 7482, 7483, 7484, 7485, 7486, 7487, 7488,
  7489, 7490, 7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7500, 7533, 7534, 7535, 7536, 7537, 7538, 7539,
  7540, 7541, 7542, 7543, 7544, 7545, 7546, 7547, 7548, 7549, 7550, 7551, 7552, 7553, 7554, 7555, 7556, 7557, 7558,
  7559, 7560, 7561, 7562, 7563, 7564, 7565, 7566, 7567, 7568, 7569, 7570, 7571, 7572, 7573, 7574, 7575, 7576, 7577,
  7578, 7579, 7580, 7581, 7582, 7583, 7584, 7585, 7586, 7587, 7588, 7589, 7590, 7591, 7592, 7593, 7594, 7595, 7596,
  7597, 7598, 7599, 7600, 7601, 7604, 7605, 7606, 7607, 7608, 7609, 7610, 7611, 7612, 7613, 7614, 7615, 7616, 7617,
  7618, 7619, 7620, 7621, 7622, 7623, 7624, 7625, 7626, 7627, 7628, 7629, 7630, 7631, 7632, 7633, 7634, 7635, 7636,
  7637, 7638, 7639, 7640, 7641, 7642, 7643, 7644, 7645, 7646, 7647, 7648, 7649, 7650, 7651, 7652, 7653, 7654, 7674,
  7706, 7707, 7708, 7709, 7710, 7711, 7712, 7714, 7715, 7966, 7967, 8114, 8115, 8116, 8117, 8118, 8119, 8123, 8124,
  8125, 8126, 8127, 8128, 8129, 8130, 8131, 8132, 8133, 8134, 8135, 8136, 8137, 8138, 8139, 8395, 8396, 8397, 8398,
  8399, 8400, 8401, 8402, 8403, 8404, 8405, 8406, 8410, 8411, 8412, 8413, 8483, 8484, 8485, 8486, 8487, 8488, 8489,
  8490, 8491, 8540, 8542, 8543, 8544, 8545, 8561, 8562, 8563, 8564, 8565, 8566, 8567, 8568, 8569, 8581, 8583, 8593,
  8619, 8687, 8688, 8773, 8774, 8777, 8779, 8781, 8911, 8912, 8913, 8922, 8993, 9001, 9002, 9003, 9004, 9010, 9011,
  9037, 9038, 9039, 9040, 9041, 9061, 9062, 9063, 9071, 9136, 9137, 9138, 9161, 9162, 9173, 9174, 9175, 9199, 9200,
  9201, 9202, 9203, 9229, 9230, 9283, 9300, 9301, 9302, 9333, 9343, 9344, 9366, 9367, 9368, 9370, 9392, 9405, 9409,
  9410, 9411, 9412, 9413, 9414, 9415, 9417, 9418, 9419, 9420, 9421, 9435, 9436, 9437, 9438, 9439, 9440, 9441, 9442,
  9459, 9587, 9588, 9598, 9603, 9637,
];

const isProcess = 1;
if (isProcess)
  updateByCampProduct({ productSelectedList, type: "all" }).then(() =>
    console.log(productSelectedList.map((i) => "https://mobile.camperest.kr/product/" + i))
  );
else console.log(productSelectedList.map((i) => "https://mobile.camperest.kr/product/" + i));

// 캠퍼레스트 제품 (판매처) 업데이트
// yarn update:camperest
