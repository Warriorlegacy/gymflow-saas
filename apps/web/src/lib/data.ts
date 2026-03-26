import {
  demoSubscriptionPlans,
  demoSubscriptions,
  demoUser,
  demoWorkouts,
} from "@gymflow/lib";
import { api } from "@gymflow/services";

export async function getDashboardData() {
  return api.getDashboard();
}

export async function getMembersData() {
  return api.getMembers();
}

export async function getPlansData() {
  return api.getPlans();
}

export async function getPaymentsData() {
  return api.getPayments();
}

export async function getAttendanceData() {
  return api.getAttendance();
}

export async function getTrainersData() {
  return api.getTrainers();
}

export async function getWorkoutsData() {
  return api.getWorkouts();
}

export async function getDietPlansData() {
  return api.getDietPlans();
}

export async function getReportsData() {
  const [workouts, dietPlans] = await Promise.all([
    api.getWorkouts(),
    api.getDietPlans(),
  ]);
  return {
    subscriptions: demoSubscriptions,
    workouts,
    dietPlans,
  };
}

export async function getBillingPlans() {
  return demoSubscriptionPlans;
}

export async function getCurrentUser() {
  return demoUser;
}
