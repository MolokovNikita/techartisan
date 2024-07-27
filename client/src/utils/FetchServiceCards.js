import axios from "axios";
import config from "../config";

export const fetchServiceDetails = async (serviceId) => {
  try {
    const res = await axios.get(`${config.API_URL}/services/${serviceId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching service details for serviceId ${serviceId}:`, error);
    return null;
  }
};

export const fetchCardDetails = async (cardId) => {
  try {
    const fetchData = async (url) => {
      try {
        const res = await axios.get(url);
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
      fetchData(`${config.API_URL}/services-order/getOne/${cardId}`),
      fetchData(`${config.API_URL}/staff-order/getOne/${cardId}`),
      fetchData(`${config.API_URL}/devices-order/getOne/${cardId}`),
      fetchData(`${config.API_URL}/status-order/getOne/${cardId}`),
      fetchData(`${config.API_URL}/offices-order/getOne/${cardId}`),
    ]);

    const servicesDetails = await Promise.all(
      serviceOrders.map(async (service) => {
        const serviceDetails = await fetchServiceDetails(service.services_id);
        return { ...service, serviceDetails };
      })
    );

    const staffDetails = await Promise.all(
      staffOrders.map(async (staff) => {
        const res = await fetchData(`${config.API_URL}/staff/${staff.staff_id}`);
        return res;
      })
    );

    const deviceDetails = await Promise.all(
      deviceOrders.map(async (device) => {
        const res = await fetchData(`${config.API_URL}/devices/${device.devices_id}`);
        return res;
      })
    );

    const statusDetails = await Promise.all(
      statusOrders.map(async (status) => {
        const res = await fetchData(`${config.API_URL}/statuses/${status.statusoforder_id}`);
        return res;
      })
    );

    const officeDetails = await Promise.all(
      officeOrders.map(async (office) => {
        const res = await fetchData(`${config.API_URL}/offices/${office.offices_id}`);
        return res;
      })
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
    const res = await axios.get(
      `${config.API_URL}/order-card/client/${clientId}`,
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching client orders for clientId ${clientId}:`, error);
    return [];
  }
};
