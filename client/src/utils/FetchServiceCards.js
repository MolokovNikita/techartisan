import axios from "axios";
import config from "../config";

export const fetchServiceDetails = async (serviceId) => {
  try {
    const res = await axios.get(`${config.API_URL}/services/${serviceId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchCardDetails = async (cardId) => {
  try {
    const [
      serviceOrders,
      staffOrders,
      deviceOrders,
      statusOrders,
      officeOrders,
    ] = await Promise.all([
      axios.get(`${config.API_URL}/services-order/getOne/${cardId}`),
      axios.get(`${config.API_URL}/staff-order/getOne/${cardId}`),
      axios.get(`${config.API_URL}/devices-order/getOne/${cardId}`),
      axios.get(`${config.API_URL}/status-order/getOne/${cardId}`),
      axios.get(`${config.API_URL}/offices-order/getOne/${cardId}`),
    ]);

    const servicesDetails = await Promise.all(
      serviceOrders.data.map(async (service) => {
        const serviceDetails = await fetchServiceDetails(service.services_id);
        return { ...service, serviceDetails };
      }),
    );

    const staffDetails = await Promise.all(
      staffOrders.data.map(async (staff) => {
        const res = await axios.get(
          `${config.API_URL}/staff/${staff.staff_id}`,
        );
        return res.data;
      }),
    );

    const deviceDetails = await Promise.all(
      deviceOrders.data.map(async (device) => {
        const res = await axios.get(
          `${config.API_URL}/devices/${device.devices_id}`,
        );
        return res.data;
      }),
    );

    const statusDetails = await Promise.all(
      statusOrders.data.map(async (status) => {
        const res = await axios.get(
          `${config.API_URL}/statuses/${status.statusoforder_id}`,
        );
        return res.data;
      }),
    );

    const officeDetails = await Promise.all(
      officeOrders.data.map(async (office) => {
        const res = await axios.get(
          `${config.API_URL}/offices/${office.offices_id}`,
        );
        return res.data;
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
    console.error(error);
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
    console.error(error);
    return [];
  }
};
