import axios from 'axios';

const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:4000'
).replace(/\/$/, '');

const TRIPSAFE_BASE = `${API_BASE}/tripsafe`;

const INSURER_LABELS = {
  ABHI: 'Aditya Birla Health Insurance',
};

const getInsurerLabel = (code) =>
  INSURER_LABELS[String(code || '').toUpperCase()] ||
  (code ? `${code} Insurance` : 'Insurance partner');

const getProductPrice = (product, travellerCount = 1) => {
  const ppdf = product?.pfd?.ppd?.ppdf || {};
  // Use the key matching traveller count, fall back to "1"
  const key = String(travellerCount);
  const ifc = (ppdf[key]?.[0] || ppdf['1']?.[0])?.ifc || {};
  const perTravellerTF = Number(ifc.TF || 0);
  if (perTravellerTF) return perTravellerTF * travellerCount;

  // Fallbacks
  const fromTotal = product?.tfd?.ifc?.TF;
  const fromTraveller = product?.iti?.[0]?.fd?.ifc?.TF;
  const fallback = product?.ptf;
  return Number(fromTotal || fromTraveller || fallback || 0);
};

/** Extract full price breakdown using the correct ppdf key for traveller count */
const getPriceBreakdown = (product, travellerCount = 1) => {
  const ppdf = product?.pfd?.ppd?.ppdf || {};
  const key = String(travellerCount);
  const ifc = (ppdf[key]?.[0] || ppdf['1']?.[0])?.ifc || {};
  const perTF = Number(ifc.TF || 0);
  return {
    sp: Number(ifc.SP || 0) * travellerCount,
    spGst: Number(ifc.SPGST || 0),           // GST is already total in response
    tf: perTF * travellerCount,               // Total fare
    perTravellerTf: perTF,                    // Per-traveller price
    ac: Number(ifc.AC || 0),                  // Agent commission (earn) — already total
    bxp: Number(ifc.BXP || 0),
    bxpGst: Number(ifc.BXPGST || 0),
    ip: Number(ifc.IP || 0),
    ipGst: Number(ifc.IPGST || 0),
    ap: Number(ifc.AP || 0),
    apGst: Number(ifc.APGST || 0),
    bf: Number(ifc.BF || 0),
  };
};

const mapBenefits = (product) => {
  const pbft = Array.isArray(product?.pbft) ? product.pbft : [];
  const seen = new Set();
  const benefits = [];

  pbft.forEach((item) => {
    const name = item?.name?.trim();
    if (!name || seen.has(name)) return;
    seen.add(name);
    benefits.push({
      name,
      category: item?.ic || item?.type || 'Other',
      coverage: item?.sumins || '',
      description: item?.dsc || '',
      type: item?.type || '',
      bv: item?.bv || '',
      bfp: item?.bfp || '',
    });
  });

  return benefits;
};

export const mapTripSafeSearchResponse = (payload) => {
  const raw = payload?.data || payload;

  // TripJack wraps student/AMT results the same way but sometimes under data.data
  const dataRoot = raw?.data || raw;
  const pli =
    dataRoot?.isr?.iinfo?.pli ||
    raw?.isr?.iinfo?.pli ||
    [];

  // Traveller count from the search query
  const travellerCount = Math.max(1, (dataRoot?.isq?.iti || raw?.isq?.iti || []).length);
  const packages = [];

  pli.forEach((plan) => {
    const plid = plan?.plid;
    const products = Array.isArray(plan?.pi) ? plan.pi : [];

    products.forEach((product) => {
      const benefits = mapBenefits(product);
      const highlights = (product?.pbft || [])
        .filter((b) => ['BANNER', 'QUOTATION'].includes(String(b?.bv || '').toUpperCase()))
        .slice(0, 4)
        .map((b) => b?.name)
        .filter(Boolean);

      const assistanceBenefits = benefits
        .filter((b) => String(b.type).toUpperCase().includes('ASSISTANCE'))
        .map((b) => b.name);
      const coverageBenefits = benefits
        .filter((b) => String(b.type).toUpperCase().includes('INSURANCE'))
        .map((b) => b.name);

      // BANNER benefits for the card display (shown as checkmark tags)
      const bannerAssistance = (product?.pbft || [])
        .filter((b) => String(b?.bv || '').toUpperCase() === 'BANNER' &&
          String(b?.type || '').toUpperCase().includes('ASSISTANCE'))
        .map((b) => b?.name)
        .filter(Boolean);

      const bannerCoverage = (product?.pbft || [])
        .filter((b) => String(b?.bv || '').toUpperCase() === 'BANNER' &&
          String(b?.type || '').toUpperCase().includes('INSURANCE'))
        .map((b) => b?.name)
        .filter(Boolean);

      const partners = Array.isArray(product?.aps) ? product.aps : [];
      const assistancePartner =
        partners.find((p) => /assist|boxx|zetexa|brb/i.test(p)) || partners[0] || '';

      // Earn amount: AC field from ppdf (already total for all travellers)
      const earnAmount = Number(
        (product?.pfd?.ppd?.ppdf?.[String(travellerCount)]?.[0] ||
         product?.pfd?.ppd?.ppdf?.['1']?.[0])?.ifc?.AC || 0
      );
      const priceBreakdown = getPriceBreakdown(product, travellerCount);

      packages.push({
        plid,
        pid: product?.pid,
        planLabel: product?.pi || 'Insurance Plan',
        coverageAmount: product?.pn || '',
        regionName: product?.rname || '',
        insurer: product?.ip || '',
        insurerLabel: getInsurerLabel(product?.ip),
        partners,
        assistancePartner,
        price: getProductPrice(product, travellerCount),
        travellerCount,
        earnAmount,
        priceBreakdown,
        highlights,
        benefits,
        assistanceTags: bannerAssistance.length ? bannerAssistance : assistanceBenefits.slice(0, 3),
        coverageTags: bannerCoverage.length ? bannerCoverage : coverageBenefits.slice(0, 3),
        benefitsCount: benefits.length,
        rawProduct: product,
      });
    });
  });

  packages.sort((a, b) => a.price - b.price);

  return {
    status: true,
    count: packages.length,
    searchId: raw?.isq?.searchId || raw?.searchIds?.[0] || null,
    bid: raw?.bid || null,
    data: packages,
    raw,
  };
};

export const extractInsuranceBookingId = (reviewPayload) => {
  const raw = reviewPayload?.data || reviewPayload;
  return raw?.bid || raw?.bookingId || null;
};

export const extractReviewPlanPrice = (reviewPayload, pid, travellerCount = 1) => {
  const raw = reviewPayload?.data || reviewPayload;
  const pli = raw?.iinfo?.pli || [];
  const count = Math.max(1, travellerCount || (raw?.isq?.iti || []).length || 1);
  for (const plan of pli) {
    const products = Array.isArray(plan?.pi) ? plan.pi : [];
    const match = products.find((p) => p.pid === pid) || products[0];
    if (match) return getProductPrice(match, count);
  }
  return 0;
};

export const searchTripSafeInsurance = async (searchPayload, options = {}) => {
  const useEmbedded = Boolean(options.embedded || searchPayload?.isq?.isef);
  const endpoint = useEmbedded ? '/search/embedded' : '/search';
  const response = await axios.post(`${TRIPSAFE_BASE}${endpoint}`, searchPayload);
  const body = response.data;

  // Backend wraps as { status: true, data: <tripjack_response> }
  // TripJack itself has { status: { success: true } } inside data
  if (!body?.status) {
    return {
      status: false,
      message: body?.message || 'Insurance search failed',
      details: body?.details || null,
    };
  }

  const tripjackData = body.data || body;

  // Check TripJack-level status
  if (tripjackData?.status && !tripjackData.status?.success) {
    return {
      status: false,
      message: tripjackData?.status?.httpStatus
        ? `TripJack error: ${tripjackData.status.httpStatus}`
        : 'Insurance search failed',
      details: tripjackData,
    };
  }

  return mapTripSafeSearchResponse(tripjackData);
};

export const reviewTripSafeInsurance = async (reviewPayload) => {
  const response = await axios.post(`${TRIPSAFE_BASE}/review`, reviewPayload);
  return response.data;
};

export const bookTripSafeInsurance = async (bookPayload) => {
  const response = await axios.post(`${TRIPSAFE_BASE}/book`, bookPayload);
  return response.data;
};

export const mapTripSafeBookingDetails = (payload) => {
  const raw = payload?.data || payload;
  const order = raw?.order || {};
  const insurance = raw?.itemInfos?.INSURANCE || {};
  const iinfo = insurance?.iinfo || {};
  const isq = insurance?.isq || {};
  const product = iinfo?.pli?.[0]?.pi?.[0] || {};
  const travellers = product?.iti?.length ? product.iti : isq?.iti || [];
  const price =
    Number(order?.amount) ||
    Number(product?.tfd?.ifc?.TF) ||
    Number(product?.iti?.[0]?.fd?.ifc?.TF) ||
    0;

  const plid = iinfo?.pli?.[0]?.plid || '';
  const pid = product?.pid || '';

  return {
    bookingId: order.bookingId || raw?.bookingId,
    orderStatus: order.status || insurance?.ios || '—',
    amount: price,
    markup: order.markup,
    createdOn: order.createdOn,
    deliveryInfo: order.deliveryInfo || {},
    plid,
    pid,
    planLabel: product?.pi || 'Insurance Plan',
    coverageAmount: product?.pn || '',
    regionName: product?.rname || '',
    insurer: product?.ip || '',
    insurerLabel: getInsurerLabel(product?.ip),
    partners: Array.isArray(product?.aps) ? product.aps : [],
    activeFrom: iinfo?.activeFrom || isq?.sd,
    startDate: isq?.sd,
    endDate: isq?.ed,
    benefits: mapBenefits(product),
    travellers: travellers.map((t) => ({
      id: t.id,
      name: [t.fn, t.ln].filter(Boolean).join(' ') || '—',
      age: t.age,
      email: t.eid,
      mobile: t.cnum,
      passport: t.pnum,
      pincode: t.pincode,
      gender: t.gen === 'F' ? 'Female' : t.gen === 'M' ? 'Male' : t.gen,
      policyId: t.policyId,
      nominee: t.ni?.[0]?.nn || t.ni?.[0]?.nr,
    })),
    raw,
  };
};

export const getTripSafeBookingDetails = async (bookingId) => {
  const response = await axios.post(`${TRIPSAFE_BASE}/booking-details`, {
    bookingId,
  });
  const body = response.data;

  if (!body?.status) {
    return {
      status: false,
      message: body?.message || 'Failed to load booking details',
      details: body?.details || null,
    };
  }

  return {
    status: true,
    ...mapTripSafeBookingDetails(body.data || body),
  };
};

export const buildCancellationTravellerKeys = (details, selectedTravellerIds = null) => {
  const { plid, pid, travellers } = details;
  if (!plid || !pid) {
    throw new Error('Missing plan or product id for cancellation');
  }

  const ids = selectedTravellerIds?.length
    ? selectedTravellerIds
    : travellers.map((t) => t.id);

  return {
    [plid]: {
      [pid]: ids.map((id) => ({ id: Number(id) })),
    },
  };
};

export const buildCancellationPayload = (details, selectedTravellerIds = null) => ({
  bookingId: details.bookingId,
  type: 'CANCELLATION',
  travellerKeys: buildCancellationTravellerKeys(details, selectedTravellerIds),
});

export const extractAmendmentId = (payload) => {
  const raw = payload?.data || payload;
  return (
    raw?.amendmentId ||
    raw?.amendment?.amendmentId ||
    raw?.amendment?.id ||
    null
  );
};

export const raiseInsuranceCancellation = async (details, selectedTravellerIds = null) => {
  const body = buildCancellationPayload(details, selectedTravellerIds);
  const response = await axios.post(`${TRIPSAFE_BASE}/amendment/raise`, body);
  const resBody = response.data;

  if (!resBody?.status) {
    return {
      status: false,
      message: resBody?.message || 'Failed to raise cancellation',
      details: resBody?.details || null,
    };
  }

  const amendmentId = extractAmendmentId(resBody.data || resBody);
  return {
    status: true,
    amendmentId,
    payload: body,
    raw: resBody.data || resBody,
  };
};

export const confirmInsuranceCancellation = async (
  details,
  amendmentId,
  selectedTravellerIds = null
) => {
  if (!amendmentId) {
    return { status: false, message: 'Missing amendmentId from raise step' };
  }

  const body = {
    ...buildCancellationPayload(details, selectedTravellerIds),
    amendmentId,
  };

  const response = await axios.post(
    `${TRIPSAFE_BASE}/amendment/confirm-cancellation`,
    body
  );
  const resBody = response.data;

  if (!resBody?.status) {
    return {
      status: false,
      message: resBody?.message || 'Failed to confirm cancellation',
      details: resBody?.details || null,
    };
  }

  return {
    status: true,
    raw: resBody.data || resBody,
  };
};

export const reviewInsurancePlan = async (pkg) => {
  const reviewPayload = {
    pli: [
      {
        plid: pkg.plid,
        pi: [{ pid: pkg.pid }],
      },
    ],
  };

  const response = await reviewTripSafeInsurance(reviewPayload);
  if (!response?.status) {
    return {
      status: false,
      message: response?.message || 'Insurance review failed',
      details: response?.details || null,
    };
  }

  const bookingId = extractInsuranceBookingId(response.data || response);
  // Use travellerCount from the original search package
  const price =
    extractReviewPlanPrice(response.data || response, pkg.pid, pkg.travellerCount) ||
    pkg.price;

  return {
    status: true,
    bookingId,
    price,
    reviewData: response.data || response,
  };
};
