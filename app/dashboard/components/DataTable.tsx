"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import InfoTooltip from "./InfoToolTip"
import { formatNumber, formatCurrency, formatPercentage } from "../utils/formatters"

interface DataTableProps {
  data: any
}

interface TableSection {
  title: string
  titleHindi: string
  icon: string
  rows: TableRow[]
}

interface TableRow {
  label: string
  labelHindi: string
  value: string | number
  key: string
  tooltip: string
  highlight?: boolean
}

export default function DataTable({ data }: DataTableProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["employment"]))
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"sections" | "all">("sections")
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(tableRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
    }
  }, [])

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const expandAll = () => {
    setExpandedSections(new Set(tableSections.map((s) => s.title)))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  const tableSections: TableSection[] = [
    {
      title: "employment",
      titleHindi: "रोजगार जानकारी",
      icon: "👥",
      rows: [
        {
          label: "Total Households Worked",
          labelHindi: "कुल परिवार काम किए",
          value: formatNumber(data.Total_Households_Worked),
          key: "Total_Households_Worked",
          tooltip: "Number of households that received employment under MGNREGA",
          highlight: true,
        },
        {
          label: "Total Individuals Worked",
          labelHindi: "कुल व्यक्ति काम किए",
          value: formatNumber(data.Total_Individuals_Worked),
          key: "Total_Individuals_Worked",
          tooltip: "Total number of individual workers who got employment",
        },
        {
          label: "Total Active Job Cards",
          labelHindi: "कुल सक्रिय जॉब कार्ड",
          value: formatNumber(data.Total_No_of_Active_Job_Cards),
          key: "Total_No_of_Active_Job_Cards",
          tooltip: "Number of active job cards in the district",
        },
        {
          label: "Total Job Cards Issued",
          labelHindi: "कुल जारी किए गए जॉब कार्ड",
          value: formatNumber(data.Total_No_of_JobCards_issued),
          key: "Total_No_of_JobCards_issued",
          tooltip: "Total number of job cards issued till date",
        },
        {
          label: "Total Active Workers",
          labelHindi: "कुल सक्रिय कर्मचारी",
          value: formatNumber(data.Total_No_of_Active_Workers),
          key: "Total_No_of_Active_Workers",
          tooltip: "Number of active workers registered",
        },
        {
          label: "Total Workers",
          labelHindi: "कुल कर्मचारी",
          value: formatNumber(data.Total_No_of_Workers),
          key: "Total_No_of_Workers",
          tooltip: "Total number of workers registered",
        },
        {
          label: "Average Days per Household",
          labelHindi: "प्रति परिवार औसत दिन",
          value: data.Average_days_of_employment_provided_per_Household,
          key: "Average_days_of_employment_provided_per_Household",
          tooltip: "Average number of days of employment provided per household (Target: 100 days)",
          highlight: true,
        },
        {
          label: "Households Completed 100 Days",
          labelHindi: "100 दिन पूरे किए गए परिवार",
          value: formatNumber(data.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
          key: "Total_No_of_HHs_completed_100_Days_of_Wage_Employment",
          tooltip: "Number of households that completed the guaranteed 100 days of employment",
        },
        {
          label: "Total Person Days",
          labelHindi: "कुल व्यक्ति दिवस",
          value: formatNumber(data.Persondays_of_Central_Liability_so_far),
          key: "Persondays_of_Central_Liability_so_far",
          tooltip: "Total person-days of employment generated",
        },
      ],
    },
    {
      title: "financial",
      titleHindi: "वित्तीय जानकारी",
      icon: "💰",
      rows: [
        {
          label: "Total Expenditure",
          labelHindi: "कुल व्यय",
          value: formatCurrency(data.Total_Exp),
          key: "Total_Exp",
          tooltip: "Total funds spent on MGNREGA",
          highlight: true,
        },
        {
          label: "Wages",
          labelHindi: "मजदूरी",
          value: formatCurrency(data.Wages),
          key: "Wages",
          tooltip: "Total wages paid to workers",
          highlight: true,
        },
        {
          label: "Material and Skilled Wages",
          labelHindi: "सामग्री और कुशल मजदूरी",
          value: formatCurrency(data.Material_and_skilled_Wages),
          key: "Material_and_skilled_Wages",
          tooltip: "Expenditure on materials and skilled labor",
        },
        {
          label: "Administrative Expenditure",
          labelHindi: "प्रशासनिक व्यय",
          value: formatCurrency(data.Total_Adm_Expenditure),
          key: "Total_Adm_Expenditure",
          tooltip: "Administrative costs",
        },
        {
          label: "Average Wage Rate per Day",
          labelHindi: "प्रति दिन औसत मजदूरी दर",
          value: formatCurrency(data.Average_Wage_rate_per_day_per_person),
          key: "Average_Wage_rate_per_day_per_person",
          tooltip: "Average daily wage paid per person",
        },
        {
          label: "Approved Labour Budget",
          labelHindi: "अनुमोदित श्रम बजट",
          value: formatCurrency(data.Approved_Labour_Budget),
          key: "Approved_Labour_Budget",
          tooltip: "Total approved budget for labour",
        },
      ],
    },
    {
      title: "works",
      titleHindi: "कार्य जानकारी",
      icon: "🏗️",
      rows: [
        {
          label: "Total Works Taken Up",
          labelHindi: "कुल लिए गए काम",
          value: formatNumber(data.Total_No_of_Works_Takenup),
          key: "Total_No_of_Works_Takenup",
          tooltip: "Total number of works initiated",
        },
        {
          label: "Completed Works",
          labelHindi: "पूर्ण किए गए काम",
          value: formatNumber(data.Number_of_Completed_Works),
          key: "Number_of_Completed_Works",
          tooltip: "Number of works completed",
          highlight: true,
        },
        {
          label: "Ongoing Works",
          labelHindi: "चल रहे काम",
          value: formatNumber(data.Number_of_Ongoing_Works),
          key: "Number_of_Ongoing_Works",
          tooltip: "Number of works currently in progress",
        },
        {
          label: "Payments Within 15 Days",
          labelHindi: "15 दिनों के भीतर भुगतान",
          value: formatPercentage(data.percentage_payments_gererated_within_15_days),
          key: "percentage_payments_gererated_within_15_days",
          tooltip: "Percentage of payments made within 15 days (MGNREGA compliance)",
          highlight: true,
        },
        {
          label: "GPs with NIL Expenditure",
          labelHindi: "शून्य व्यय वाले ग्राम पंचायत",
          value: formatNumber(data.Number_of_GPs_with_NIL_exp),
          key: "Number_of_GPs_with_NIL_exp",
          tooltip: "Number of Gram Panchayats with no expenditure",
        },
      ],
    },
    {
      title: "demographic",
      titleHindi: "जनसांख्यिकीय जानकारी",
      icon: "👨‍👩‍👧‍👦",
      rows: [
        {
          label: "Women Person Days",
          labelHindi: "महिला व्यक्ति दिवस",
          value: formatNumber(data.Women_Persondays),
          key: "Women_Persondays",
          tooltip: "Person-days of employment provided to women",
          highlight: true,
        },
        {
          label: "SC Person Days",
          labelHindi: "अनुसूचित जाति व्यक्ति दिवस",
          value: formatNumber(data.SC_persondays),
          key: "SC_persondays",
          tooltip: "Person-days of employment for Scheduled Caste workers",
        },
        {
          label: "SC Workers (Active)",
          labelHindi: "अनुसूचित जाति कर्मचारी (सक्रिय)",
          value: formatNumber(data.SC_workers_against_active_workers),
          key: "SC_workers_against_active_workers",
          tooltip: "Number of SC workers among active workers",
        },
        {
          label: "ST Person Days",
          labelHindi: "अनुसूचित जनजाति व्यक्ति दिवस",
          value: formatNumber(data.ST_persondays),
          key: "ST_persondays",
          tooltip: "Person-days of employment for Scheduled Tribe workers",
        },
        {
          label: "ST Workers (Active)",
          labelHindi: "अनुसूचित जनजाति कर्मचारी (सक्रिय)",
          value: formatNumber(data.ST_workers_against_active_workers),
          key: "ST_workers_against_active_workers",
          tooltip: "Number of ST workers among active workers",
        },
        {
          label: "Differently Abled Workers",
          labelHindi: "विकलांग कर्मचारी",
          value: formatNumber(data.Differently_abled_persons_worked),
          key: "Differently_abled_persons_worked",
          tooltip: "Number of differently abled persons who got employment",
        },
      ],
    },
    {
      title: "categories",
      titleHindi: "श्रेणी जानकारी",
      icon: "📊",
      rows: [
        {
          label: "Category B Works (%)",
          labelHindi: "श्रेणी बी काम (%)",
          value: formatPercentage(data.percent_of_Category_B_Works),
          key: "percent_of_Category_B_Works",
          tooltip: "Percentage of Category B works (individual beneficiary works)",
        },
        {
          label: "Agriculture Allied Works Expenditure (%)",
          labelHindi: "कृषि संबंधित कार्य व्यय (%)",
          value: formatPercentage(data.percent_of_Expenditure_on_Agriculture_Allied_Works),
          key: "percent_of_Expenditure_on_Agriculture_Allied_Works",
          tooltip: "Percentage of expenditure on agriculture and allied works",
        },
        {
          label: "NRM Expenditure (%)",
          labelHindi: "प्राकृतिक संसाधन प्रबंधन व्यय (%)",
          value: formatPercentage(data.percent_of_NRM_Expenditure),
          key: "percent_of_NRM_Expenditure",
          tooltip: "Percentage of expenditure on Natural Resource Management works",
        },
      ],
    },
  ]

  const getFilteredSections = () => {
    if (!searchQuery.trim()) return tableSections

    const query = searchQuery.toLowerCase()
    return tableSections
      .map((section) => ({
        ...section,
        rows: section.rows.filter(
          (row) =>
            row.label.toLowerCase().includes(query) ||
            row.labelHindi.includes(query) ||
            row.value.toString().toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.rows.length > 0)
  }

  const filteredSections = getFilteredSections()

  const allRows = tableSections.flatMap((section) => section.rows)
  const filteredAllRows = searchQuery.trim()
    ? allRows.filter(
        (row) =>
          row.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.labelHindi.includes(searchQuery) ||
          row.value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allRows

  return (
    <div ref={tableRef} className="bg-linear-to-br from-slate-50 to-slate-100 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="खोज मेट्रिक्स... / Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
            <svg
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("sections")}
              className={`px-4 cursor-pointer py-2.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === "sections"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              📑 Sections
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2.5 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                viewMode === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              📋 All Data
            </button>
          </div>

          {viewMode === "sections" && (
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-2.5 cursor-pointer text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                ⬇️ Expand
              </button>
              <button
                onClick={collapseAll}
                className="px-3 cursor-pointer py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                ⬆️ Collapse
              </button>
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="mb-6 text-sm text-slate-600 bg-white px-4 py-3 rounded-lg border border-slate-200">
            Found{" "}
            {viewMode === "sections"
              ? filteredSections.reduce((sum, s) => sum + s.rows.length, 0)
              : filteredAllRows.length}{" "}
            matching metrics
          </div>
        )}

        {viewMode === "sections" && (
          <div className="space-y-4">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <div
                  key={section.title}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{section.icon}</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-slate-900 capitalize">{section.title}</h3>
                        <p className="text-sm text-slate-500">{section.titleHindi}</p>
                      </div>
                      <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {section.rows.length}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        expandedSections.has(section.title) ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedSections.has(section.title) && (
                    <div className="px-6 pb-4 border-t border-slate-100">
                      <div className="space-y-3 pt-4">
                        {section.rows.map((row) => (
                          <div
                            key={row.key}
                            className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${
                              row.highlight ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{row.label}</p>
                                <p className="text-xs text-slate-500">{row.labelHindi}</p>
                              </div>
                              
                              <InfoTooltip content={row.tooltip} />
                         
                              
                            </div>
                            <div
                              className={`text-right ml-4 ${row.highlight ? "text-lg font-bold text-blue-900" : "text-base font-semibold text-slate-900"}`}
                            >
                              {row.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-lg text-slate-600">No matching data found</p>
              </div>
            )}
          </div>
        )}

        {viewMode === "all" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Metric / मेट्रिक्स
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Value / मूल्य
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-12">
                      Info
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAllRows.length > 0 ? (
                    filteredAllRows.map((row, index) => (
                      <tr
                        key={row.key}
                        className={`hover:bg-slate-50 transition-colors ${row.highlight ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900">{row.label}</div>
                          <div className="text-xs text-slate-500">{row.labelHindi}</div>
                        </td>
                        <td
                          className={`px-6 py-4 text-right whitespace-nowrap ${row.highlight ? "text-base font-bold text-blue-900" : "text-sm font-semibold text-slate-900"}`}
                        >
                          {row.value}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <InfoTooltip content={row.tooltip} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-lg text-slate-600">No matching data found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              const csv = allRows.map((row) => `"${row.label}","${row.labelHindi}","${row.value}"`).join("\n")
              const blob = new Blob([`"Metric","मेट्रिक्स","Value"\n${csv}`], { type: "text/csv" })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `mgnrega-${data.district_name}-${data.month}-${data.fin_year}.csv`
              a.click()
            }}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all font-medium cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}
