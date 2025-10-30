// app/dashboard/components/DistrictSelector.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useGsapFadeIn } from '../hooks/useGsapFadeIn';

interface District {
  district_code: string;
  district_name: string;
  district_name_assamese?: string;
}

interface DistrictSelectorProps {
  selectedDistrict: string;
  onDistrictChange: (districtCode: string) => void;
  selectedMonth: string;
  selectedYear: string;
  onTimeRangeChange: (month: string, year: string) => void;
}

// app/dashboard/components/DistrictSelector.tsx
// Replace the ASSAM_DISTRICTS array with these CORRECT codes:

const ASSAM_DISTRICTS: District[] = [
    { district_code: '0424', district_name: 'Baksa', district_name_assamese: 'बक्सा' },
    { district_code: '0405', district_name: 'Barpeta', district_name_assamese: 'बरपेटा' },
    { district_code: '0428', district_name: 'Biswanath', district_name_assamese: 'बिश्वनाथ' },
    { district_code: '0403', district_name: 'Bongaigaon', district_name_assamese: 'बोंगाईगांव' },
    { district_code: '0423', district_name: 'Cachar', district_name_assamese: 'कछार' },
    { district_code: '0430', district_name: 'Charaideo', district_name_assamese: 'चराइदेव' },
    { district_code: '0408', district_name: 'Darrang', district_name_assamese: 'दरांग' },
    { district_code: '0411', district_name: 'Dhemaji', district_name_assamese: 'धेमा जी' },
    { district_code: '0401', district_name: 'Dhubri', district_name_assamese: 'धुबरी' },
    { district_code: '0410', district_name: 'Dima Hasao', district_name_assamese: 'डिमा हासाओ' },
    { district_code: '0404', district_name: 'Goalpara', district_name_assamese: 'गोलपाड़ा' },
    { district_code: '0414', district_name: 'Golaghat', district_name_assamese: 'गोलाघाट' },
    { district_code: '0422', district_name: 'Hailakandi', district_name_assamese: 'हैलाकांडी' },
    { district_code: '0415', district_name: 'Jorhat', district_name_assamese: 'जोरहाट' },
    { district_code: '0407', district_name: 'Kamrup', district_name_assamese: 'कामरूप' },
    { district_code: '0426', district_name: 'Kamrup Metropolitan', district_name_assamese: 'कामरूप महानगरीय' },
    { district_code: '0417', district_name: 'Karbi Anglong', district_name_assamese: 'कार्बी आंगलोंग' },
    { district_code: '0419', district_name: 'Karimganj', district_name_assamese: 'करीमगंज' },
    { district_code: '0420', district_name: 'Kokrajhar', district_name_assamese: 'कोकराझार' },
    { district_code: '0432', district_name: 'Majuli', district_name_assamese: 'माजुली' },
    { district_code: '0412', district_name: 'Morigaon', district_name_assamese: 'मोरीगांव' },
    { district_code: '0413', district_name: 'Nagaon', district_name_assamese: 'नगांव' },
    { district_code: '0425', district_name: 'Sivasagar', district_name_assamese: 'शिवसागर' },
    { district_code: '0409', district_name: 'Sonitpur', district_name_assamese: 'शोणितपुर' },
    { district_code: '0418', district_name: 'Tinsukia', district_name_assamese: 'तिनसुकिया' },
    { district_code: '0427', district_name: 'Udalguri', district_name_assamese: 'उदलगुड़ी' },
    { district_code: '0434', district_name: 'West Karbi Anglong', district_name_assamese: 'पश्चिम कार्बी आंगलोंग' },  
];

const MONTHS = [
  { value: '1', label: 'January', assamese: 'জানুৱাৰী' },
  { value: '2', label: 'February', assamese: 'ফেব্ৰুৱাৰী' },
  { value: '3', label: 'March', assamese: 'মাৰ্চ' },
  { value: '4', label: 'April', assamese: 'এপ্ৰিল' },
  { value: '5', label: 'May', assamese: 'মে' },
  { value: '6', label: 'June', assamese: 'জুন' },
  { value: '7', label: 'July', assamese: 'জুলাই' },
  { value: '8', label: 'August', assamese: 'আগষ্ট' },
  { value: '9', label: 'September', assamese: 'চেপ্তেম্বৰ' },
  { value: '10', label: 'October', assamese: 'অক্টোবৰ' },
  { value: '11', label: 'November', assamese: 'নৱেম্বৰ' },
  { value: '12', label: 'December', assamese: 'ডিচেম্বৰ' },
];

export default function DistrictSelector({
  selectedDistrict,
  onDistrictChange,
  selectedMonth,
  selectedYear,
  onTimeRangeChange,
}: DistrictSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('');
  const [showAssamOnlyModal, setShowAssamOnlyModal] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectorRef = useGsapFadeIn({ duration: 0.5 });

  // Filter districts based on search
  const filteredDistricts = ASSAM_DISTRICTS.filter(district =>
    district.district_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.district_name_assamese?.includes(searchQuery)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-detect location on mount (only once)
  useEffect(() => {
    const hasAutoDetected = sessionStorage.getItem('location_detected');
    if (!hasAutoDetected && !selectedDistrict) {
      handleAutoDetect();
      sessionStorage.setItem('location_detected', 'true');
    }

    if (!selectedMonth || !selectedYear) {
      const currentDate = new Date();
      if (!selectedMonth) {
        onTimeRangeChange((currentDate.getMonth() + 1).toString(), selectedYear);
      }
      if (!selectedYear) {
        onTimeRangeChange(selectedMonth, currentDate.getFullYear().toString());
      }

      }}, []);

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectionStatus('📍 Detecting your location...');

    try {
      // Try GPS first
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setDetectionStatus('🔍 Finding your district...');

            // Call backend API to detect district
            try {
              const response = await fetch('/api/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: latitude, lng: longitude }),
              });

              const data = await response.json();

              if (data.success && data.district) {
                // Check if it's Assam
                if (data.district.state_code === '04') {
                  setDetectionStatus(`✅ Detected: ${data.district.district_name}, Assam`);
                  onDistrictChange(data.district.district_code);
                } else {
                  // Not Assam - show modal
                  setDetectedLocation(`${data.district.district_name}, ${data.district.state_name}`);
                  setShowAssamOnlyModal(true);
                }
              } else {
                fallbackToIPDetection();
              }
            } catch (error) {
              console.error('District detection failed:', error);
              fallbackToIPDetection();
            }

            setIsDetecting(false);
          },
          (error) => {
            console.error('GPS error:', error);
            fallbackToIPDetection();
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        fallbackToIPDetection();
      }
    } catch (error) {
      console.error('Location detection error:', error);
      setDetectionStatus('');
      setIsDetecting(false);
    }
  };

  const fallbackToIPDetection = async () => {
    setDetectionStatus('🌐 Trying IP-based detection...');

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useIP: true }),
      });

      const data = await response.json();

      if (data.success && data.district) {
        if (data.district.state_code === '04') {
          setDetectionStatus(`✅ Detected: ${data.district.district_name}, Assam`);
          onDistrictChange(data.district.district_code);
        } else {
          setDetectedLocation(`${data.district.state_name}`);
          setShowAssamOnlyModal(true);
        }
      } else {
        setDetectionStatus('');
      }
    } catch (error) {
      console.error('IP detection failed:', error);
      setDetectionStatus('');
    }

    setIsDetecting(false);
  };

  const handleManualSelect = (districtCode: string) => {
    onDistrictChange(districtCode);
    setShowDropdown(false);
    setSearchQuery('');
    setDetectionStatus('');
  };

  const selectedDistrictName = ASSAM_DISTRICTS.find(
    d => d.district_code === selectedDistrict
  )?.district_name || '';

  return (
    <>
      <div ref={selectorRef} className="space-y-3">
        {/* District Selection */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            जिला / District
          </label>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-4 py-3 text-left bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className={selectedDistrict ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                  {selectedDistrict ? selectedDistrictName : 'Select a district...'}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    showDropdown ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search district... / জিলা বিচাৰক..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {/* District List */}
                <div className="overflow-y-auto max-h-60">
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district) => (
                      <button
                        key={district.district_code}
                        onClick={() => handleManualSelect(district.district_code)}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 ${
                          selectedDistrict === district.district_code
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{district.district_name}</div>
                            {district.district_name_assamese && (
                              <div className="text-sm text-gray-600">{district.district_name_assamese}</div>
                            )}
                          </div>
                          {selectedDistrict === district.district_code && (
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      No districts found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Auto-detect Button */}
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting}
            className="mt-2 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isDetecting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Detecting...
              </span>
            ) : (
              '📍 Auto-Detect My District'
            )}
          </button>

          {/* Detection Status */}
          {detectionStatus && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {detectionStatus}
            </div>
          )}
        </div>

        {/* Month & Year Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => onTimeRangeChange(e.target.value, selectedYear)}
              className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => onTimeRangeChange(selectedMonth, e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assam-Only Modal */}
      {showAssamOnlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ⚠️ Currently Available for Assam Only
              </h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                अभी केवल असम के लिए उपलब्ध है
              </h4>

              <p className="text-gray-600 mb-2">
                We detected you're in <strong>{detectedLocation}</strong>
              </p>

              <p className="text-gray-600 mb-6">
                This portal currently shows data for Assam districts only. We're working to add more states soon!
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowAssamOnlyModal(false);
                    setShowDropdown(true);
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  🗺️ Explore Assam Districts
                </button>

                <button
                  onClick={() => setShowAssamOnlyModal(false)}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

