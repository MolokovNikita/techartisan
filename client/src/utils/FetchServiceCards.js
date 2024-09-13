import http from "../http/instance";

export const fetchServiceDetails = async (serviceId) => {
  try {
    const res = await http.get(`/services/${serviceId}`);
    return res.data;
  } catch (error) {
    console.error(
      `Error fetching service details for serviceId ${serviceId}:`,
      error,
    );
    return null;
  }
};

export const fetchCardDetails = async (cardId) => {
  try {
    const fetchData = async (url) => {
      try {
        const res = await http.get(url);
        return res.data;
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
      }
    };

    const [
      serviceOrders,
      staffOrders,
      deviceOrders,
      statusOrders,
      officeOrders,
    ] = await Promise.all([
      fetchData(`/services-order/getOne/${cardId}`),
      fetchData(`/staff-order/${cardId}`),
      fetchData(`/devices-order/getOne/${cardId}`),
      fetchData(`/status-order/getOne/${cardId}`),
      fetchData(`/offices-order/getOne/${cardId}`),
    ]);

    const servicesDetails = await Promise.all(
      serviceOrders.map(async (service) => {
        const serviceDetails = await fetchServiceDetails(service.services_id);
        return { ...service, serviceDetails };
      }),
    );

    const staffDetails = await Promise.all(
      staffOrders.map(async (staff) => {
        const res = await fetchData(`/staff/${staff.staff_id}`);
        return res;
      }),
    );

    const deviceDetails = await Promise.all(
      deviceOrders.map(async (device) => {
        const res = await fetchData(`/devices/${device.devices_id}`);
        return res;
      }),
    );

    const statusDetails = await Promise.all(
      statusOrders.map(async (status) => {
        const res = await fetchData(`/statuses/${status.statusoforder_id}`);
        return res;
      }),
    );

    const officeDetails = await Promise.all(
      officeOrders.map(async (office) => {
        const res = await fetchData(`/offices/${office.offices_id}`);
        return res;
      }),
    );

    return {
      services: servicesDetails,
      staff: staffDetails,
      devices: deviceDetails,
      status: statusDetails,
      office: officeDetails,
    };
  } catch (error) {
    console.error(`Error fetching card details for cardId ${cardId}:`, error);
    return null;
  }
};

export const fetchClientOrders = async (clientId) => {
  try {
    const res = await http.get(`/order-card/client/${clientId}`);
    return res.data;
  } catch (error) {
    console.error(
      `Error fetching client orders for clientId ${clientId}:`,
      error,
    );
    return [];
  }
};
