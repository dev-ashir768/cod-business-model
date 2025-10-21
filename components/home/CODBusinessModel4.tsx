"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import { Download, EyeClosed, EyeIcon } from 'lucide-react';

// The xlsx library is not available, so we will use a pure JavaScript solution for export.
// import * as XLSX from 'xlsx';

// --- SECURITY WARNING ---
const CORRECT_PASSWORD = "cod_report!786**&&";

// --- Login Page Component Props Interface ---
interface LoginPageProps {
  onLoginSuccess: () => void;
}

// --- Login Page Component ---
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-[Inter]">
      <div className="p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Enter Password</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {isPasswordVisible ? (
                <EyeClosed className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Parent Component for Protection ---
const ProtectedBusinessModel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Logout timer ke liye reference
  const logoutTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    Cookies.remove('authToken');
    setIsAuthenticated(false);
    console.log("Session expired or logged out.");
  };

  const handleLogin = () => {
    const token = Date.now().toString(); // Simple token
    const expiryTimeInHours = 1;
    const expiryDate = new Date(new Date().getTime() + expiryTimeInHours * 60 * 60 * 1000);

    Cookies.set('authToken', token, { expires: expiryDate });
    setIsAuthenticated(true);

    // 1 ghante baad auto-logout ke liye timer set karein
    logoutTimer.current = setTimeout(handleLogout, expiryTimeInHours * 60 * 60 * 1000);
  };

  // Page load per cookie check karein
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setIsAuthenticated(true);
      // Agar user refresh karta hai to logout timer dobara set karein
      logoutTimer.current = setTimeout(handleLogout, 1 * 60 * 60 * 1000);
    }
    // Cleanup function to clear timer on component unmount
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <CODBusinessModel />
    </div>
  );
};


// Interface for the business parameters state
interface ParametersState {
  initialInvestment: number;
  initialPartners: number;
  saudiPartners: number;
  misaLicense: number;
  commercialRegistration: number;
  municipalLicense: number;
  logisticsLicense: number;
  documentationCosts: number;
  bankAccountSetup: number;
  legalProfessionalFees: number;
  officeSetupDeposit: number;
  visaCost: number;
  workPermitCost: number;
  iqamaRenewalCost: number;
  visaCostApplicability: number;
  workPermitCostApplicability: number;
  iqamaRenewalApplicability: number;
  misaAnnualRenewal: number;
  commercialRegistrationRenewal: number;
  standardCODRate: number;
  premiumCODRate: number;
  warehousingRate: number;
  financeRate: number;
  standardPercentage: number;
  premiumPercentage: number;
  warehousingPercentage: number;
  financePercentage: number;
  initialOrdersPerDay: number;
  monthlyGrowthRate: number;
  useFixedGrowthPattern: boolean;
  avgOrderValue: number;
  threePlPaymentDays: number;
  premiumSettlementDays: number;
  baseOpsStaffSalary: number;
  baseSalesStaffSalary: number;
  basePartnerSalary: number;
  opsStaffPer1000Orders: number;
  salesStaffPer1000Orders: number;
  minOpsStaff: number;
  minSalesStaff: number;
  baseWarehouseCost: number;
  otherCosts: number;
  warehouseExpansionMonth: number;
  warehouseExpansionCost: number;
  fullServiceExpansionMonth: number;
  fullServiceWarehouseCost: number;
  // Re-adding the cost parameters with new, more realistic default values
  adminCostPerEmployee: number;
  adminCostBaseline: number;
  technologyCostPercentage: number;
  technologyCostBaseline: number;
  marketingCostPercentage: number;
  marketingCostBaseline: number;
}

// Interface for each entry in the growth pattern data
interface GrowthPatternEntry {
  month: number;
  ordersPerDay: number;
  description: string;
}

// Interface for the monthly projection data
interface ProjectionMonth {
  month: number;
  description: string;
  ordersPerDay: number;
  monthlyOrders: number;
  opsStaff: number;
  salesStaff: number;
  partners: number;
  totalStaff: number;
  staffRequiringVisas: number;
  staffApplicableForVisas: number;
  staffApplicableForWorkPermits: number;
  staffApplicableForIqama: number;
  warehouseCost: number;
  staffSalary: number;
  visaCosts: number;
  workPermitCosts: number;
  iqamaCosts: number;
  annualRenewalCosts: number;
  otherCosts: number;
  companySetupCosts: number;
  totalCosts: number;
  standardRevenue: number;
  premiumRevenue: number;
  warehousingRevenue: number;
  financeRevenue: number;
  totalRevenue: number;
  monthlyProfit: number;
  cumulativeProfit: number;
  cashPosition: number;
  codWorkingCapital: number;
  premiumCODSettlement: number;
  profitMargin: number;
  newOpsStaff: number;
  newSalesStaff: number;
  // Re-adding the cost fields to the projection data
  adminCost: number;
  technologyCost: number;
  marketingCost: number;
}

// Interface for the key metrics object
interface KeyMetrics {
  breakEvenMonth: number | null;
  finalMonthlyProfit: number;
  finalCashPosition: number;
  finalOrdersPerDay: number;
  finalOpsStaff: number;
  finalSalesStaff: number;
  finalPartners: number;
  finalTotalStaff: number;
  finalMonthlyRevenue: number;
  roi: number;
  totalRevenue36Months: number;
  totalCosts36Months: number;
  totalProfit36Months: number;
  avgMonthlyProfit: number;
  peakMonthlyProfit: number;
}


const CODBusinessModel: React.FC = () => {
  // Business parameters state
  const [parameters, setParameters] = useState<ParametersState>({
    initialInvestment: 400000,
    initialPartners: 4,
    saudiPartners: 1,
    misaLicense: 12000,
    commercialRegistration: 6000,
    municipalLicense: 3000,
    logisticsLicense: 15000,
    documentationCosts: 4000,
    bankAccountSetup: 10000,
    legalProfessionalFees: 25000,
    officeSetupDeposit: 20000,
    visaCost: 2000,
    workPermitCost: 9600,
    iqamaRenewalCost: 650,
    visaCostApplicability: 1,
    workPermitCostApplicability: 1,
    iqamaRenewalApplicability: 3,
    misaAnnualRenewal: 62000,
    commercialRegistrationRenewal: 1200,
    // Restoring the default values that led to a positive ROI before
    standardCODRate: 5.0, 
    premiumCODRate: 8.0,  
    warehousingRate: 2.5, 
    financeRate: 3.0,     
    standardPercentage: 50,
    premiumPercentage: 50,
    warehousingPercentage: 40,
    financePercentage: 0,
    initialOrdersPerDay: 100,
    monthlyGrowthRate: 14,
    useFixedGrowthPattern: false,
    avgOrderValue: 175,
    threePlPaymentDays: 3,
    premiumSettlementDays: 1,
    baseOpsStaffSalary: 2500,
    baseSalesStaffSalary: 4000,
    basePartnerSalary: 0,
    opsStaffPer1000Orders: 2.5,
    salesStaffPer1000Orders: 1.8,
    minOpsStaff: 1,
    minSalesStaff: 1,
    baseWarehouseCost: 5000,
    otherCosts: 500,
    warehouseExpansionMonth: 13,
    warehouseExpansionCost: 10000,
    fullServiceExpansionMonth: 25,
    fullServiceWarehouseCost: 15000,
    // Restored cost parameters
    adminCostPerEmployee: 1000,
    adminCostBaseline: 5000,   
    technologyCostPercentage: 2, 
    technologyCostBaseline: 5000,
    marketingCostPercentage: 2,  
    marketingCostBaseline: 5000,
  });

  // Pre-defined growth pattern from Excel data
  const growthPattern: GrowthPatternEntry[] = [
    { month: 0, ordersPerDay: 0, description: "Business Setup" },
    { month: 1, ordersPerDay: 100, description: "Operations Start" },
    { month: 2, ordersPerDay: 125, description: "Strong Start" },
    { month: 3, ordersPerDay: 150, description: "Growth" },
    { month: 4, ordersPerDay: 175, description: "Continued Growth" },
    { month: 5, ordersPerDay: 200, description: "Staff Addition #1" },
    { month: 6, ordersPerDay: 225, description: "Strong Performance" },
    { month: 7, ordersPerDay: 250, description: "Accelerating" },
    { month: 8, ordersPerDay: 275, description: "Good Progress" },
    { month: 9, ordersPerDay: 300, description: "Scaling Up" },
    { month: 10, ordersPerDay: 325, description: "Staff Addition #2" },
    { month: 11, ordersPerDay: 350, description: "Pre Year-End" },
    { month: 12, ordersPerDay: 375, description: "Year 1 End" },
    { month: 13, ordersPerDay: 450, description: "Warehousing Expansion" },
    { month: 24, ordersPerDay: 1275, description: "Year 2 End" },
    { month: 25, ordersPerDay: 1400, description: "Full Service Expansion" },
    { month: 36, ordersPerDay: 2775, description: "Final Scale" }
  ];

  // Helper function to calculate staff affected by costs based on applicability
  const calculateStaffForCost = (applicability: number, opsStaff: number, salesStaff: number, nonSaudiPartners: number): number => {
    switch (applicability) {
      case 1: // All Staff
        return opsStaff + salesStaff + nonSaudiPartners;
      case 2: // Sales Staff & Partners
        return salesStaff + nonSaudiPartners;
      case 3: // Partners Only
        return nonSaudiPartners;
      case 4: // No Staff
        return 0;
      default:
        return opsStaff + salesStaff + nonSaudiPartners;
    }
  };

  // Calculate financial projections
  const projections: ProjectionMonth[] = useMemo(() => {
    const months: ProjectionMonth[] = [];
    let cumulativeProfit = 0;
    let cashPosition = parameters.initialInvestment;
    let prevOpsStaff = 0;
    let prevSalesStaff = 0;
    const ADMIN_COST_STAFF_THRESHOLD = 10; // Hardcoded threshold

    for (let month = 0; month <= 36; month++) {
      // Get orders per day
      let ordersPerDay = 0;
      let description = "";

      if (parameters.useFixedGrowthPattern) {
        if (month <= 13) {
          const pattern = growthPattern.find(p => p.month === month);
          if (pattern) {
            ordersPerDay = pattern.ordersPerDay;
            description = pattern.description;
          } else {
            const prevPattern = growthPattern.filter(p => p.month < month).pop();
            const nextPattern = growthPattern.find(p => p.month > month);
            if (prevPattern && nextPattern) {
              const ratio = (month - prevPattern.month) / (nextPattern.month - prevPattern.month);
              ordersPerDay = Math.round(prevPattern.ordersPerDay + (nextPattern.ordersPerDay - prevPattern.ordersPerDay) * ratio);
              description = `Growth Month ${month}`;
            }
          }
        } else if (month <= 24) {
          const ratio = (month - 13) / (24 - 13);
          ordersPerDay = Math.round(450 + (1275 - 450) * ratio);
          description = `Year 2 Growth - Month ${month}`;
        } else if (month <= 36) {
          if (month === 25) {
            ordersPerDay = 1400;
            description = "Full Service Expansion";
          } else if (month === 36) {
            ordersPerDay = 2775;
            description = "Final Scale";
          } else {
            const ratio = (month - 25) / (36 - 25);
            ordersPerDay = Math.round(1400 + (2775 - 1400) * ratio);
            description = `Final Growth - Month ${month}`;
          }
        }
      } else {
        if (month === 0) {
          ordersPerDay = 0;
          description = "Business Setup";
        } else {
          const growthFactor = Math.pow(1 + parameters.monthlyGrowthRate / 100, month - 1);
          ordersPerDay = Math.round(parameters.initialOrdersPerDay * growthFactor);

          if (month === 1) description = "Operations Start";
          else if (month === 3) description = "Early Growth";
          else if (month === 6) description = "Steady Growth";
          else if (month === 12) description = "Year 1 End";
          else if (month === 18) description = "Mid Growth";
          else if (month === 24) description = "Year 2 End";
          else if (month === 30) description = "Scale Phase";
          else if (month === 36) description = "Final Scale";
          else description = `Month ${month} Growth`;
        }
      }

      const monthlyOrders = ordersPerDay * 26;

      // Staff calculation
      let opsStaff = parameters.minOpsStaff;
      let salesStaff = parameters.minSalesStaff;

      if (parameters.useFixedGrowthPattern) {
        if (ordersPerDay >= 325) {
          opsStaff = 2;
          salesStaff = 1;
        } else if (ordersPerDay >= 200) {
          opsStaff = 1;
          salesStaff = 1;
        }
        if (month >= 25) {
          opsStaff = Math.max(opsStaff, Math.ceil(ordersPerDay / 500));
          salesStaff = Math.max(salesStaff, Math.ceil(ordersPerDay / 400));
        }
        if (month === 36) {
          opsStaff = 6;
          salesStaff = 9;
        }
      } else {
        if (ordersPerDay > 0) {
          opsStaff = Math.max(parameters.minOpsStaff, Math.ceil((ordersPerDay / 1000) * parameters.opsStaffPer1000Orders));
          salesStaff = Math.max(parameters.minSalesStaff, Math.ceil((ordersPerDay / 1000) * parameters.salesStaffPer1000Orders));
        }
      }
      
      const partners = parameters.initialPartners;
      const totalStaff = opsStaff + salesStaff + partners;
      const nonSaudiPartners = partners - parameters.saudiPartners;
      const nonPartnerStaff = opsStaff + salesStaff;
      const staffRequiringVisas = totalStaff - parameters.saudiPartners;
      
      const staffApplicableForVisas = calculateStaffForCost(parameters.visaCostApplicability, opsStaff, salesStaff, nonSaudiPartners);
      const staffApplicableForWorkPermits = calculateStaffForCost(parameters.workPermitCostApplicability, opsStaff, salesStaff, nonSaudiPartners);
      const staffApplicableForIqama = calculateStaffForCost(parameters.iqamaRenewalApplicability, opsStaff, salesStaff, nonSaudiPartners);

      // Revenue calculations must happen BEFORE costs that depend on revenue
      let standardRevenue = 0;
      let premiumRevenue = 0;
      let warehousingRevenue = 0;
      let financeRevenue = 0;
      if (month > 0) {
        const standardOrders = Math.round(monthlyOrders * parameters.standardPercentage / 100);
        const premiumOrders = Math.round(monthlyOrders * parameters.premiumPercentage / 100);
        const warehousingOrders = Math.round(monthlyOrders * parameters.warehousingPercentage / 100);
        const financeOrders = Math.round(monthlyOrders * parameters.financePercentage / 100);

        standardRevenue = standardOrders * parameters.standardCODRate;
        premiumRevenue = premiumOrders * parameters.premiumCODRate;
        warehousingRevenue = warehousingOrders * parameters.warehousingRate;
        financeRevenue = financeOrders * parameters.financeRate;
      }
      const totalRevenue = standardRevenue + premiumRevenue + warehousingRevenue + financeRevenue;

      // Cost calculations can now happen
      let warehouseCost = parameters.baseWarehouseCost;
      if (month >= parameters.fullServiceExpansionMonth) {
        warehouseCost = parameters.fullServiceWarehouseCost;
      } else if (month >= parameters.warehouseExpansionMonth) {
        warehouseCost = parameters.warehouseExpansionCost;
      }

      const staffSalary = (opsStaff * parameters.baseOpsStaffSalary) + (salesStaff * parameters.baseSalesStaffSalary) + (partners * parameters.basePartnerSalary);
      const newOpsStaff = month === 0 ? opsStaff : Math.max(0, opsStaff - prevOpsStaff);
      const newSalesStaff = month === 0 ? salesStaff : Math.max(0, salesStaff - prevSalesStaff);

      let visaCosts = 0;
      let workPermitCosts = 0;
      let iqamaCosts = 0;
      let annualRenewalCosts = 0;

      if (month === 0) {
        visaCosts = staffApplicableForVisas * parameters.visaCost;
        workPermitCosts = staffApplicableForWorkPermits * parameters.workPermitCost;
        iqamaCosts = staffApplicableForIqama * parameters.iqamaRenewalCost;
      } else {
        const newStaffForVisas = calculateStaffForCost(parameters.visaCostApplicability, newOpsStaff, newSalesStaff, 0);
        const newStaffForWorkPermits = calculateStaffForCost(parameters.workPermitCostApplicability, newOpsStaff, newSalesStaff, 0);
        const newStaffForIqama = calculateStaffForCost(parameters.iqamaRenewalApplicability, newOpsStaff, newSalesStaff, 0);

        visaCosts = newStaffForVisas * parameters.visaCost;
        workPermitCosts = newStaffForWorkPermits * parameters.workPermitCost;
        iqamaCosts = newStaffForIqama * parameters.iqamaRenewalCost;
      }

      if (month > 0 && month % 12 === 0) {
        annualRenewalCosts = parameters.misaAnnualRenewal + parameters.commercialRegistrationRenewal;
        workPermitCosts += staffApplicableForWorkPermits * parameters.workPermitCost;
        iqamaCosts += staffApplicableForIqama * parameters.iqamaRenewalCost;
      }

      prevOpsStaff = opsStaff;
      prevSalesStaff = salesStaff;

      let otherCosts = parameters.otherCosts;

      let companySetupCosts = 0;
      if (month === 0) {
        companySetupCosts = parameters.misaLicense + parameters.commercialRegistration + parameters.municipalLicense + parameters.logisticsLicense + parameters.documentationCosts + parameters.bankAccountSetup + parameters.legalProfessionalFees + parameters.officeSetupDeposit;
        otherCosts = 5500;
      }

      // Re-introducing operational cost calculations
      const adminTieredBaseline = nonPartnerStaff > 0 ? Math.ceil(nonPartnerStaff / ADMIN_COST_STAFF_THRESHOLD) * parameters.adminCostBaseline : 0;
      const perEmployeeAdminCost = nonPartnerStaff * parameters.adminCostPerEmployee;
      const adminCost = adminTieredBaseline + perEmployeeAdminCost;

      const revenueBasedTechCost = totalRevenue * (parameters.technologyCostPercentage / 100);
      const technologyCost = month > 0 ? Math.max(parameters.technologyCostBaseline, revenueBasedTechCost) : 0;

      const revenueBasedMarketingCost = totalRevenue * (parameters.marketingCostPercentage / 100);
      const marketingCost = month > 0 ? Math.max(parameters.marketingCostBaseline, revenueBasedMarketingCost) : 0;

      const totalCosts = warehouseCost + staffSalary + adminCost + technologyCost + marketingCost + visaCosts + workPermitCosts + iqamaCosts + annualRenewalCosts + otherCosts + companySetupCosts;

      // COD Working Capital
      let codWorkingCapital = 0;
      let premiumCODSettlement = 0;
      if (month > 0) {
        const dailyPremiumOrders = Math.round(ordersPerDay * parameters.premiumPercentage / 100);
        const workingCapitalDays = Math.max(0, parameters.threePlPaymentDays - parameters.premiumSettlementDays);
        premiumCODSettlement = dailyPremiumOrders * parameters.avgOrderValue;
        codWorkingCapital = premiumCODSettlement * workingCapitalDays;
      }

      const monthlyProfit = totalRevenue - totalCosts;

      if (month === 0) {
        cumulativeProfit = monthlyProfit;
        cashPosition = parameters.initialInvestment + monthlyProfit;
      } else {
        cumulativeProfit += monthlyProfit;
        cashPosition += monthlyProfit - (codWorkingCapital - (months[month - 1]?.codWorkingCapital || 0));
      }

      months.push({
        month, description, ordersPerDay, monthlyOrders, opsStaff, salesStaff, partners, totalStaff,
        staffRequiringVisas, // Fix: Explicitly defining the property
        staffApplicableForVisas, staffApplicableForWorkPermits, staffApplicableForIqama,
        warehouseCost: Math.round(warehouseCost),
        staffSalary: Math.round(staffSalary),
        visaCosts: Math.round(visaCosts),
        workPermitCosts: Math.round(workPermitCosts),
        iqamaCosts: Math.round(iqamaCosts),
        annualRenewalCosts: Math.round(annualRenewalCosts),
        otherCosts: Math.round(otherCosts),
        companySetupCosts: Math.round(companySetupCosts),
        totalCosts: Math.round(totalCosts),
        standardRevenue: Math.round(standardRevenue),
        premiumRevenue: Math.round(premiumRevenue),
        warehousingRevenue: Math.round(warehousingRevenue),
        financeRevenue: Math.round(financeRevenue),
        totalRevenue: Math.round(totalRevenue),
        monthlyProfit: Math.round(monthlyProfit),
        cumulativeProfit: Math.round(cumulativeProfit),
        cashPosition: Math.round(cashPosition),
        codWorkingCapital: Math.round(codWorkingCapital),
        premiumCODSettlement: Math.round(premiumCODSettlement),
        profitMargin: totalRevenue > 0 ? Math.round((monthlyProfit / totalRevenue) * 100) : 0,
        newOpsStaff, newSalesStaff,
        adminCost: Math.round(adminCost),
        technologyCost: Math.round(technologyCost),
        marketingCost: Math.round(marketingCost),
      });
    }

    return months;
  }, [parameters]);

  // Key metrics calculations
  const totalSetupCosts: number = useMemo(() => {
    const partnersNeedingVisas = parameters.initialPartners - parameters.saudiPartners;
    return parameters.misaLicense +
      parameters.commercialRegistration +
      parameters.municipalLicense +
      parameters.logisticsLicense +
      parameters.documentationCosts +
      parameters.bankAccountSetup +
      parameters.legalProfessionalFees +
      parameters.officeSetupDeposit +
      (partnersNeedingVisas * parameters.visaCost) +
      (partnersNeedingVisas * parameters.workPermitCost);
  }, [parameters]);

  const keyMetrics: KeyMetrics = useMemo(() => {
    const breakEvenMonth = projections.find(p => p.cumulativeProfit > 0)?.month || null;
    const finalMonth = projections[projections.length - 1];
    const totalRevenue36Months = projections.slice(1).reduce((sum, p) => sum + p.totalRevenue, 0);
    const totalCosts36Months = projections.reduce((sum, p) => sum + p.totalCosts, 0);
    const totalProfit36Months = totalRevenue36Months - totalCosts36Months;
    const roi = ((finalMonth.cashPosition - parameters.initialInvestment) / parameters.initialInvestment) * 100;
    const avgMonthlyProfit = projections.slice(13, 37).reduce((sum, p) => sum + p.monthlyProfit, 0) / 24;
    const peakMonthlyProfit = Math.max(...projections.map(p => p.monthlyProfit));

    return {
      breakEvenMonth,
      finalMonthlyProfit: finalMonth.monthlyProfit,
      finalCashPosition: finalMonth.cashPosition,
      finalOrdersPerDay: finalMonth.ordersPerDay,
      finalOpsStaff: finalMonth.opsStaff,
      finalSalesStaff: finalMonth.salesStaff,
      finalPartners: finalMonth.partners,
      finalTotalStaff: finalMonth.totalStaff,
      finalMonthlyRevenue: finalMonth.totalRevenue,
      roi: Math.round(roi),
      totalRevenue36Months: Math.round(totalRevenue36Months),
      totalCosts36Months: Math.round(totalCosts36Months),
      totalProfit36Months: Math.round(totalProfit36Months),
      avgMonthlyProfit: Math.round(avgMonthlyProfit),
      peakMonthlyProfit: Math.round(peakMonthlyProfit)
    };
  }, [projections, parameters.initialInvestment]);

  const handleParameterChange = (key: keyof ParametersState, value: string | boolean) => {
    setParameters(prev => ({
      ...prev,
      [key]: typeof value === 'boolean' ? value : parseFloat(value as string) || 0
    }));
  };

  type ApplicabilityKeys = 'visaCostApplicability' | 'workPermitCostApplicability' | 'iqamaRenewalApplicability';
  const handleApplicabilityChange = (key: ApplicabilityKeys, value: string) => {
    setParameters(prev => ({
      ...prev,
      [key]: parseInt(value, 10)
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const chartData: ProjectionMonth[] = projections.slice(1, 37);

  const keyMilestones: ProjectionMonth[] = [
    projections[1],
    projections[6],
    projections[12],
    projections[13],
    projections[24],
    projections[25],
    projections[36]
  ].filter((p): p is ProjectionMonth => Boolean(p));

  const handleExport = () => {
    // We will use a pure JavaScript approach to generate a CSV file,
    // as external libraries like `xlsx` cannot be imported.
    const headers = [
      "Month", "Description", "Orders/Day", "Monthly Orders", "Partners", "Ops Staff", "Sales Staff",
      "Total Staff",
      "Admin Cost", "Technology Cost", "Marketing Cost",
      "Warehouse Cost", "Staff Salary", "Visa Costs", "Work Permit Costs",
      "Iqama Costs", "Annual Renewals", "Other Costs", "Company Setup", "Total Costs",
      "Standard COD Revenue", "Premium COD Revenue", "Warehousing Revenue", "Finance Revenue", "Total Revenue",
      "Monthly Profit", "COD Working Capital", "Daily Premium Settlement", "Cumulative Profit", "Cash Position"
    ];

    const dataRows = projections.map(p => [
      p.month, p.description, p.ordersPerDay, p.monthlyOrders, p.partners, p.opsStaff, p.salesStaff,
      p.totalStaff,
      p.adminCost, p.technologyCost, p.marketingCost,
      p.warehouseCost, p.staffSalary, p.visaCosts, p.workPermitCosts,
      p.iqamaCosts, p.annualRenewalCosts, p.otherCosts, p.companySetupCosts, p.totalCosts,
      p.standardRevenue, p.premiumRevenue, p.warehousingRevenue, p.financeRevenue, p.totalRevenue, p.monthlyProfit,
      p.codWorkingCapital, p.premiumCODSettlement, p.cumulativeProfit, p.cashPosition
    ]);

    const csvContent = [
      headers.join(','), // Join headers with commas
      ...dataRows.map(row => row.join(',')) // Join each row's data with commas
    ].join('\n'); // Join all rows with newlines

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', "COD_Business_Model_Projections.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4 md:p-6 font-[Inter]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 md:p-8 rounded-2xl mb-8 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">🚀 COD Business Financial Model</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">📊 400,000 SAR Investment - Saudi Arabia Market</h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90">Interactive Financial Projections with Partners, Ops & Sales Staff Scaling</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs sm:text-sm opacity-80">Initial Investment</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{formatCurrency(parameters.initialInvestment)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs sm:text-sm opacity-80">Break-Even Month</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">Month {keyMetrics.breakEvenMonth || 'N/A'}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs sm:text-sm opacity-80">36-Month ROI</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{keyMetrics.roi.toLocaleString()}%</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-xs sm:text-sm opacity-80">KSA Setup Cost</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{formatCurrency(totalSetupCosts)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Setup Costs & Parameters */}
          <div className="lg:col-span-1 space-y-8">
            {/* Setup Costs Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">🏢 KSA Setup & Renewal Costs</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-orange-600">One-Time Setup Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">MISA License</span><span className="font-semibold">{formatCurrency(parameters.misaLicense)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Commercial Registration</span><span className="font-semibold">{formatCurrency(parameters.commercialRegistration)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Municipal License</span><span className="font-semibold">{formatCurrency(parameters.municipalLicense)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Logistics License</span><span className="font-semibold">{formatCurrency(parameters.logisticsLicense)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Documentation Costs</span><span className="font-semibold">{formatCurrency(parameters.documentationCosts)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Bank Account Setup</span><span className="font-semibold">{formatCurrency(parameters.bankAccountSetup)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Legal & Professional Fees</span><span className="font-semibold">{formatCurrency(parameters.legalProfessionalFees)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">Office Setup Deposit</span><span className="font-semibold">{formatCurrency(parameters.officeSetupDeposit)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">{parameters.initialPartners - parameters.saudiPartners} Partner Visas</span><span className="font-semibold">{formatCurrency((parameters.initialPartners - parameters.saudiPartners) * parameters.visaCost)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded"><span className="text-sm">{parameters.initialPartners - parameters.saudiPartners} Partner Work Permits</span><span className="font-semibold">{formatCurrency((parameters.initialPartners - parameters.saudiPartners) * parameters.workPermitCost)}</span></div>
                  <div className="border-t-2 border-orange-500 pt-2 mt-2">
                    <div className="flex justify-between items-center p-2 bg-orange-100 rounded font-bold"><span>Total Setup Cost</span><span className="text-orange-600">{formatCurrency(totalSetupCosts)}</span></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Annual Renewals (Every 12 Months)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded"><span className="text-sm">MISA License Renewal</span><span className="font-semibold text-red-600">{formatCurrency(parameters.misaAnnualRenewal)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded"><span className="text-sm">Commercial Registration Renewal</span><span className="font-semibold text-red-600">{formatCurrency(parameters.commercialRegistrationRenewal)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded"><span className="text-sm">Work Permits (per staff)</span><span className="font-semibold text-red-600">{formatCurrency(parameters.workPermitCost)}</span></div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded"><span className="text-sm">Iqama Renewals (per staff)</span><span className="font-semibold text-red-600">{formatCurrency(parameters.iqamaRenewalCost)}</span></div>
                  <div className="border-t-2 border-red-500 pt-2 mt-2">
                    <div className="flex justify-between items-center p-2 bg-red-100 rounded font-bold"><span>Fixed Annual Cost</span><span className="text-red-600">{formatCurrency(parameters.misaAnnualRenewal + parameters.commercialRegistrationRenewal)}</span></div>
                    <div className="flex justify-between items-center p-2 bg-red-100 rounded mt-2"><span>Annual Staff Costs (per staff)</span><span className="text-red-600">{formatCurrency(parameters.workPermitCost + parameters.iqamaRenewalCost)}</span></div>
                    <p className="text-xs text-red-600 mt-2">+ Staff costs scale with total staff (excluding Saudi nationals)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parameters Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">⚙️ Business Parameters</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-600">Initial Investment</h3>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (SAR)</label><input type="number" value={parameters.initialInvestment} onChange={(e) => handleParameterChange('initialInvestment', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" /></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-600">Partners Structure</h3>
                  <div className="space-y-3">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Partners</label><input type="number" value={parameters.initialPartners} onChange={(e) => handleParameterChange('initialPartners', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Saudi Partners (no visa needed)</label><input type="number" value={parameters.saudiPartners} onChange={(e) => handleParameterChange('saudiPartners', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Partner Monthly Salary (SAR)</label><input type="number" value={parameters.basePartnerSalary} onChange={(e) => handleParameterChange('basePartnerSalary', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-600">Service Rates & Mix (%)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Standard COD Rate</label>
                        <input type="number" step="0.01" value={parameters.standardCODRate} onChange={(e) => handleParameterChange('standardCODRate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mix %</label>
                        <input type="number" step="1" value={parameters.standardPercentage} onChange={(e) => handleParameterChange('standardPercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Premium COD Rate</label>
                        <input type="number" step="0.01" value={parameters.premiumCODRate} onChange={(e) => handleParameterChange('premiumCODRate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mix %</label>
                        <input type="number" step="1" value={parameters.premiumPercentage} onChange={(e) => handleParameterChange('premiumPercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehousing Rate</label>
                        <input type="number" step="0.01" value={parameters.warehousingRate} onChange={(e) => handleParameterChange('warehousingRate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mix %</label>
                        <input type="number" step="1" value={parameters.warehousingPercentage} onChange={(e) => handleParameterChange('warehousingPercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Finance Rate</label>
                        <input type="number" step="0.01" value={parameters.financeRate} onChange={(e) => handleParameterChange('financeRate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mix %</label>
                        <input type="number" step="1" value={parameters.financePercentage} onChange={(e) => handleParameterChange('financePercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-cyan-600">Operational Costs</h3>
                  <div className="space-y-4 p-3 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Admin Cost</h4>
                      <div className="space-y-3">
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Per Employee Cost (SAR)</label><input type="number" value={parameters.adminCostPerEmployee} onChange={(e) => handleParameterChange('adminCostPerEmployee', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" /></div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Baseline Cost (SAR)</label>
                            <input type="number" value={parameters.adminCostBaseline} onChange={(e) => handleParameterChange('adminCostBaseline', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                            <p className="text-xs text-gray-500 mt-1">This baseline cost is added for every 10 employees.</p>
                          </div>
                      </div>
                    </div>
                      <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Technology Cost</h4>
                      <div className="space-y-3">
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost as % of Revenue</label><input type="number" value={parameters.technologyCostPercentage} onChange={(e) => handleParameterChange('technologyCostPercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" /></div>
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Minimum Baseline Cost (SAR)</label><input type="number" value={parameters.technologyCostBaseline} onChange={(e) => handleParameterChange('technologyCostBaseline', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" /></div>
                      </div>
                    </div>
                      <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Marketing Cost</h4>
                      <div className="space-y-3">
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost as % of Revenue</label><input type="number" value={parameters.marketingCostPercentage} onChange={(e) => handleParameterChange('marketingCostPercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" /></div>
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Minimum Baseline Cost (SAR)</label><input type="number" value={parameters.marketingCostBaseline} onChange={(e) => handleParameterChange('marketingCostBaseline', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-600">Visa & Work Permit Costs</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2"><label className="block text-sm font-medium text-gray-700">Visa Cost (SAR/person)</label><input type="number" value={parameters.visaCost} onChange={(e) => handleParameterChange('visaCost', e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" /></div>
                      <div className="border border-gray-200 rounded-lg p-2"><label className="block text-sm font-medium text-gray-700 mb-2">Applies to:</label><div className="space-y-2"><label className="flex items-center"><input type="radio" name="visaCostApplicability" value="1" checked={parameters.visaCostApplicability === 1} onChange={(e) => handleApplicabilityChange('visaCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">All Staff</span></label><label className="flex items-center"><input type="radio" name="visaCostApplicability" value="2" checked={parameters.visaCostApplicability === 2} onChange={(e) => handleApplicabilityChange('visaCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">Sales Staff & Partners</span></label><label className="flex items-center"><input type="radio" name="visaCostApplicability" value="3" checked={parameters.visaCostApplicability === 3} onChange={(e) => handleApplicabilityChange('visaCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">Partners Only</span></label><label className="flex items-center"><input type="radio" name="visaCostApplicability" value="4" checked={parameters.visaCostApplicability === 4} onChange={(e) => handleApplicabilityChange('visaCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">No Staff</span></label></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2"><label className="block text-sm font-medium text-gray-700">Work Permit (SAR/year)</label><input type="number" value={parameters.workPermitCost} onChange={(e) => handleParameterChange('workPermitCost', e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" /></div>
                      <div className="border border-gray-200 rounded-lg p-2"><label className="block text-sm font-medium text-gray-700 mb-2">Applies to:</label><div className="space-y-2"><label className="flex items-center"><input type="radio" name="workPermitCostApplicability" value="1" checked={parameters.workPermitCostApplicability === 1} onChange={(e) => handleApplicabilityChange('workPermitCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">All Staff</span></label><label className="flex items-center"><input type="radio" name="workPermitCostApplicability" value="2" checked={parameters.workPermitCostApplicability === 2} onChange={(e) => handleApplicabilityChange('workPermitCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">Sales Staff & Partners</span></label><label className="flex items-center"><input type="radio" name="workPermitCostApplicability" value="3" checked={parameters.workPermitCostApplicability === 3} onChange={(e) => handleApplicabilityChange('workPermitCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">Partners Only</span></label><label className="flex items-center"><input type="radio" name="workPermitCostApplicability" value="4" checked={parameters.workPermitCostApplicability === 4} onChange={(e) => handleApplicabilityChange('workPermitCostApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">No Staff</span></label></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2"><label className="block text-sm font-medium text-gray-700">Iqama Renewal (SAR/year)</label><input type="number" value={parameters.iqamaRenewalCost} onChange={(e) => handleParameterChange('iqamaRenewalCost', e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" /></div>
                      <div className="border border-gray-200 rounded-lg p-2"><label className="block text-sm font-medium text-gray-700 mb-2">Applies to:</label><div className="space-y-2"><label className="flex items-center"><input type="radio" name="iqamaRenewalApplicability" value="1" checked={parameters.iqamaRenewalApplicability === 1} onChange={(e) => handleApplicabilityChange('iqamaRenewalApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">All Staff</span></label><label className="flex items-center"><input type="radio" name="iqamaRenewalApplicability" value="2" checked={parameters.iqamaRenewalApplicability === 2} onChange={(e) => handleApplicabilityChange('iqamaRenewalApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">Sales Staff & Partners</span></label><label className="flex items-center"><input type="radio" name="iqamaRenewalApplicability" value="3" checked={parameters.iqamaRenewalApplicability === 3} onChange={(e) => handleApplicabilityChange('iqamaRenewalApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">Partners Only</span></label><label className="flex items-center"><input type="radio" name="iqamaRenewalApplicability" value="4" checked={parameters.iqamaRenewalApplicability === 4} onChange={(e) => handleApplicabilityChange('iqamaRenewalApplicability', e.target.value)} className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" /><span className="text-sm">No Staff</span></label></div></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Saudi nationals are automatically excluded from all visa-related costs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Charts & Tables */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4"><h4 className="text-sm font-medium opacity-90">Total Revenue (36m)</h4><div className="text-lg font-bold">{formatCurrency(keyMetrics.totalRevenue36Months)}</div></div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4"><h4 className="text-sm font-medium opacity-90">Total Profit (36m)</h4><div className="text-lg font-bold">{formatCurrency(keyMetrics.totalProfit36Months)}</div></div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4"><h4 className="text-sm font-medium opacity-90">Peak Monthly Profit</h4><div className="text-lg font-bold">{formatCurrency(keyMetrics.peakMonthlyProfit)}</div></div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4"><h4 className="text-sm font-medium opacity-90">Final Orders/Day</h4><div className="text-lg font-bold">{formatNumber(keyMetrics.finalOrdersPerDay)}</div></div>
            </div>

            {/* Revenue & Profit Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">📈 Monthly Revenue vs Profit</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalRevenue" fill="#10b981" name="Total Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="monthlyProfit" stroke="#3b82f6" strokeWidth={3} name="Monthly Profit" />
                  <Line yAxisId="right" type="monotone" dataKey="cumulativeProfit" stroke="#ef4444" strokeWidth={2} name="Cumulative Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">📉 Monthly Cost Breakdown</h3>
              <p className="text-sm text-gray-600 mb-4">Focus on these to improve profitability. The large baselines are a primary factor in the negative ROI.</p>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="adminCost" stackId="a" fill="#6d28d9" name="Admin Cost" />
                  <Bar dataKey="technologyCost" stackId="a" fill="#1d4ed8" name="Tech Cost" />
                  <Bar dataKey="marketingCost" stackId="a" fill="#f59e0b" name="Marketing Cost" />
                  <Bar dataKey="staffSalary" stackId="a" fill="#16a34a" name="Staff Salary" />
                  <Bar dataKey="warehouseCost" stackId="a" fill="#b91c1c" name="Warehouse Cost" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Cash Flow Impact Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">💰 Cash Flow vs Working Capital Impact</h3>
                <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="monthlyProfit" fill="#10b981" name="Monthly Profit" />
                    <Bar yAxisId="left" dataKey="codWorkingCapital" fill="#f59e0b" name="COD Working Capital" />
                    <Line yAxisId="right" type="monotone" dataKey="cashPosition" stroke="#3b82f6" strokeWidth={3} name="Cash Position" />
                </ComposedChart>
                </ResponsiveContainer>
            </div>
            
            {/* Staff Growth Visualization */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">👥 Staff Growth: Partners, Ops & Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData.filter((_, i) => i % 2 === 0)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="partners" stackId="a" fill="#ef4444" name="Partners" />
                  <Bar yAxisId="left" dataKey="opsStaff" stackId="a" fill="#3b82f6" name="Ops Staff" />
                  <Bar yAxisId="left" dataKey="salesStaff" stackId="a" fill="#10b981" name="Sales Staff" />
                  <Line yAxisId="right" type="monotone" dataKey="ordersPerDay" stroke="#f59e0b" strokeWidth={3} name="Orders/Day" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Key Milestones Table */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">🎯 Key Milestones</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-3 py-3 text-left">Month</th>
                      <th className="px-3 py-3 text-left">Description</th>
                      <th className="px-3 py-3 text-center">Orders/Day</th>
                      <th className="px-3 py-3 text-center">Total Staff</th>
                      <th className="px-3 py-3 text-center">Total Revenue</th>
                      <th className="px-3 py-3 text-center">Monthly Profit</th>
                      <th className="px-3 py-3 text-center">Cash Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyMilestones.map((milestone, index) => (
                      <tr key={milestone.month} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${milestone.monthlyProfit > 0 ? 'border-l-4 border-green-400' : ''} ${milestone.month === keyMetrics.breakEvenMonth ? 'bg-green-100' : ''}`}>
                        <td className="px-3 py-3 font-bold text-blue-600">{milestone.month}</td>
                        <td className="px-3 py-3 font-medium">{milestone.description}</td>
                        <td className="px-3 py-3 text-center">{formatNumber(milestone.ordersPerDay)}</td>
                        <td className="px-3 py-3 text-center font-bold">{milestone.totalStaff}</td>
                        <td className="px-3 py-3 text-center font-bold text-blue-600">{formatCurrency(milestone.totalRevenue)}</td>
                        <td className={`px-3 py-3 text-center font-bold ${milestone.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(milestone.monthlyProfit)}</td>
                        <td className="px-3 py-3 text-center font-semibold text-orange-600">{formatCurrency(milestone.cashPosition)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>


        {/* Complete Monthly Projections Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">🗓️ Complete Monthly Projections</h3>
            <button onClick={handleExport} className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition cursor-pointer flex items-center gap-2'>
                <Download size={18} />
                Export to Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-900 text-white whitespace-nowrap">
                  <th className="px-2 py-2 text-left">Month</th>
                  <th className="px-2 py-2 text-left">Description</th>
                  <th className="px-2 py-2 text-center">Orders/Day</th>
                  <th className="px-2 py-2 text-center">Monthly Orders</th>
                  <th className="px-2 py-2 text-center">Partners</th>
                  <th className="px-2 py-2 text-center">Ops Staff</th>
                  <th className="px-2 py-2 text-center">Sales Staff</th>
                  <th className="px-2 py-2 text-center">Total Staff</th>
                  <th className="px-2 py-2 text-center">Staff Needing Visas</th>
                  <th className="px-2 py-2 text-center">Visa-Applicable</th>
                  <th className="px-2 py-2 text-center">Permit-Applicable</th>
                  <th className="px-2 py-2 text-center">Iqama-Applicable</th>
                  <th className="px-2 py-2 text-center">Warehouse Cost</th>
                  <th className="px-2 py-2 text-center">Staff Salary</th>
                  <th className="px-2 py-2 text-center">Visa Costs</th>
                  <th className="px-2 py-2 text-center">Work Permit Costs</th>
                  <th className="px-2 py-2 text-center">Iqama Costs</th>
                  <th className="px-2 py-2 text-center">Annual Renewals</th>
                  <th className="px-2 py-2 text-center">Other Costs</th>
                  <th className="px-2 py-2 text-center">Company Setup</th>
                  <th className="px-2 py-2 text-center">Total Costs</th>
                  <th className="px-2 py-2 text-center">Standard COD</th>
                  <th className="px-2 py-2 text-center">Premium COD</th>
                  <th className="px-2 py-2 text-center">Warehousing</th>
                  <th className="px-2 py-2 text-center">Finance Rev</th>
                  <th className="px-2 py-2 text-center">Total Revenue</th>
                  <th className="px-2 py-2 text-center">Monthly Profit</th>
                  <th className="px-2 py-2 text-center">COD Working Capital</th>
                  <th className="px-2 py-2 text-center">Daily Premium Settlement</th>
                  <th className="px-2 py-2 text-center">Cumulative Profit</th>
                  <th className="px-2 py-2 text-center">Cash Position</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((month, index) => (
                  <tr key={month.month} className={`whitespace-nowrap ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${month.month === 0 ? 'bg-orange-100' : ''} ${month.cumulativeProfit > 0 && (index === 0 || projections[index - 1]?.cumulativeProfit <= 0) ? 'bg-green-100' : ''}`}>
                    <td className="px-2 py-2 font-bold text-blue-600">{month.month}</td>
                    <td className="px-2 py-2 font-medium">{month.description}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.ordersPerDay)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.monthlyOrders)}</td>
                    <td className="px-2 py-2 text-center font-semibold text-red-600">{month.partners}</td>
                    <td className="px-2 py-2 text-center font-semibold text-blue-600">{month.opsStaff}</td>
                    <td className="px-2 py-2 text-center font-semibold text-green-600">{month.salesStaff}</td>
                    <td className="px-2 py-2 text-center font-bold">{month.totalStaff}</td>
                    <td className="px-2 py-2 text-center">{month.staffRequiringVisas}</td>
                    <td className="px-2 py-2 text-center">{month.staffApplicableForVisas}</td>
                    <td className="px-2 py-2 text-center">{month.staffApplicableForWorkPermits}</td>
                    <td className="px-2 py-2 text-center">{month.staffApplicableForIqama}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.warehouseCost)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.staffSalary)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.visaCosts)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.workPermitCosts)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.iqamaCosts)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.annualRenewalCosts)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.otherCosts)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.companySetupCosts)}</td>
                    <td className="px-2 py-2 text-center font-bold text-red-600">{formatNumber(month.totalCosts)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.standardRevenue)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.premiumRevenue)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.warehousingRevenue)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.financeRevenue)}</td>
                    <td className="px-2 py-2 text-center font-bold text-blue-600">{formatNumber(month.totalRevenue)}</td>
                    <td className={`px-2 py-2 text-center font-bold ${month.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(month.monthlyProfit)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.codWorkingCapital)}</td>
                    <td className="px-2 py-2 text-center">{formatNumber(month.premiumCODSettlement)}</td>
                    <td className={`px-2 py-2 text-center font-bold ${month.cumulativeProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(month.cumulativeProfit)}</td>
                    <td className="px-2 py-2 text-center font-bold text-purple-600">{formatCurrency(month.cashPosition)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Business Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">📋 Business Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Initial Investment</span><span className="font-bold text-orange-600">{formatCurrency(parameters.initialInvestment)}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Final Cash Position</span><span className="font-bold text-green-600">{formatCurrency(keyMetrics.finalCashPosition)}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Total Revenue (36 months)</span><span className="font-bold text-blue-600">{formatCurrency(keyMetrics.totalRevenue36Months)}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Total Profit (36 months)</span><span className="font-bold text-green-600">{formatCurrency(keyMetrics.totalProfit36Months)}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">ROI (%)</span><span className="font-bold text-purple-600">{keyMetrics.roi.toLocaleString()}%</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Peak Monthly Profit</span><span className="font-bold text-green-600">{formatCurrency(keyMetrics.peakMonthlyProfit)}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Break-even Month</span><span className="font-bold text-blue-600">Month {keyMetrics.breakEvenMonth}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Final Partners</span><span className="font-bold text-red-600">{keyMetrics.finalPartners}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Final Staff (Partners + Ops + Sales)</span><span className="font-bold text-purple-600">{keyMetrics.finalTotalStaff}</span></div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium">Final Orders Per Day</span><span className="font-bold text-orange-600">{formatNumber(keyMetrics.finalOrdersPerDay)}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProtectedBusinessModel;
