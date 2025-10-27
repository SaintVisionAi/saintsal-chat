'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function StatusPage() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const systemStatus = {
    overall: 'operational',
    uptime: '99.97%',
    lastIncident: '12 days ago',
    activeUsers: '8,543',
    responseTime: '98ms'
  }

  const services = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '45ms',
      description: 'Core API routing and load balancing',
      lastUpdate: '2 minutes ago'
    },
    {
      name: 'HACP™ Protocol Engine',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '120ms',
      description: 'Human-AI Connection Protocol processing',
      lastUpdate: '1 minute ago'
    },
    {
      name: 'AI Model Serving',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '180ms',
      description: 'Machine learning model inference',
      lastUpdate: '30 seconds ago'
    },
    {
      name: 'Enterprise Dashboard',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '85ms',
      description: 'Customer portal and management interface',
      lastUpdate: '1 minute ago'
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '35ms',
      description: 'User authentication and authorization',
      lastUpdate: '45 seconds ago'
    },
    {
      name: 'Data Pipeline',
      status: 'maintenance',
      uptime: '99.92%',
      responseTime: '210ms',
      description: 'Real-time data processing and analytics',
      lastUpdate: '5 minutes ago'
    },
    {
      name: 'File Storage',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '65ms',
      description: 'Document and media file storage',
      lastUpdate: '2 minutes ago'
    },
    {
      name: 'Notification System',
      status: 'operational',
      uptime: '99.96%',
      responseTime: '55ms',
      description: 'Email and push notification delivery',
      lastUpdate: '3 minutes ago'
    }
  ]

  const regions = [
    {
      name: 'US East (Virginia)',
      status: 'operational',
      latency: '12ms',
      load: '67%'
    },
    {
      name: 'US West (California)',
      status: 'operational',
      latency: '18ms',
      load: '72%'
    },
    {
      name: 'Europe (Frankfurt)',
      status: 'operational',
      latency: '23ms',
      load: '58%'
    },
    {
      name: 'Asia Pacific (Singapore)',
      status: 'operational',
      latency: '31ms',
      load: '63%'
    }
  ]

  const recentIncidents = [
    {
      id: 1,
      title: 'Scheduled Maintenance - Data Pipeline Optimization',
      status: 'investigating',
      severity: 'minor',
      startTime: new Date(Date.now() - 45 * 60000),
      description: 'Performing routine optimization on data processing pipeline. Minor delays expected.',
      updates: [
        { time: new Date(Date.now() - 45 * 60000), message: 'Maintenance window started. Data Pipeline moved to maintenance mode.' },
        { time: new Date(Date.now() - 30 * 60000), message: 'Optimization in progress. All other services operating normally.' },
        { time: new Date(Date.now() - 15 * 60000), message: 'Testing improved pipeline performance. ETA 30 minutes.' }
      ]
    },
    {
      id: 2,
      title: 'API Rate Limiting Adjustment',
      status: 'resolved',
      severity: 'minor',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60000),
      resolvedTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 45 * 60000),
      description: 'Adjusted rate limiting thresholds to accommodate increased enterprise usage.',
      updates: [
        { time: new Date(Date.now() - 2 * 24 * 60 * 60000), message: 'Investigating reports of rate limiting issues.' },
        { time: new Date(Date.now() - 2 * 24 * 60 * 60000 + 20 * 60000), message: 'Root cause identified. Updating rate limit configurations.' },
        { time: new Date(Date.now() - 2 * 24 * 60 * 60000 + 45 * 60000), message: 'Issue resolved. Rate limits optimized for current usage patterns.' }
      ]
    },
    {
      id: 3,
      title: 'Authentication Service Latency Spike',
      status: 'resolved',
      severity: 'minor',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60000),
      resolvedTime: new Date(Date.now() - 7 * 24 * 60 * 60000 + 2 * 60 * 60000),
      description: 'Brief increase in authentication response times due to database optimization.',
      updates: [
        { time: new Date(Date.now() - 7 * 24 * 60 * 60000), message: 'Monitoring elevated authentication latency.' },
        { time: new Date(Date.now() - 7 * 24 * 60 * 60000 + 60 * 60000), message: 'Database optimization in progress.' },
        { time: new Date(Date.now() - 7 * 24 * 60 * 60000 + 2 * 60 * 60000), message: 'Performance restored to normal levels.' }
      ]
    }
  ]

  const metrics = [
    { name: 'Total Requests', value: '2.4M', change: '+12%', period: 'last 24h' },
    { name: 'Successful Requests', value: '99.97%', change: '+0.02%', period: 'last 24h' },
    { name: 'Avg Response Time', value: '98ms', change: '-5ms', period: 'last 24h' },
    { name: 'Active Connections', value: '8,543', change: '+234', period: 'now' },
    { name: 'Data Processed', value: '847GB', change: '+18%', period: 'last 24h' },
    { name: 'AI Requests', value: '1.8M', change: '+15%', period: 'last 24h' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400'
      case 'maintenance': return 'text-yellow-400'
      case 'degraded': return 'text-orange-400'
      case 'outage': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅'
      case 'maintenance': return '🔧'
      case 'degraded': return '⚠️'
      case 'outage': return '🔴'
      default: return '❓'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-500/20 text-yellow-400'
      case 'major': return 'bg-orange-500/20 text-orange-400'
      case 'critical': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/Wallst.png"
            alt="System Status Dashboard"  
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">System</span>
              <span className="block text-gradient-yellow">Status</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Real-time status of SaintVision AI platform services, infrastructure, and performance metrics. 
              Transparency you can trust for mission-critical enterprise deployments.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-green rounded-full px-4 py-2">
                <span className="text-sm text-green-400">✅ All Systems Operational</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">📊 99.97% Uptime</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-gray-400">🕐 Updated: {currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Overall Status */}
          <section className="mb-20">
            <div className={`rounded-2xl p-8 ${systemStatus.overall === 'operational' ? 'glass-green' : 'glass-yellow'}`}>
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getStatusIcon(systemStatus.overall)}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {systemStatus.overall === 'operational' ? 'All Systems Operational' : 'Minor Issues Detected'}
                </h2>
                <p className="text-gray-300 mb-8">
                  SaintVision AI platform is running smoothly with {systemStatus.uptime} uptime over the last 30 days.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{systemStatus.uptime}</div>
                    <div className="text-sm text-gray-400">30-Day Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{systemStatus.responseTime}</div>
                    <div className="text-sm text-gray-400">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{systemStatus.activeUsers}</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">{systemStatus.lastIncident}</div>
                    <div className="text-sm text-gray-400">Last Incident</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Status */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Service <span className="text-gradient-yellow">Status</span>
            </h2>
            
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="glass rounded-lg p-6">
                  <div className="grid lg:grid-cols-5 gap-4 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl">{getStatusIcon(service.status)}</span>
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                      </div>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-semibold capitalize ${getStatusColor(service.status)}`}>
                        {service.status}
                      </div>
                      <div className="text-gray-500 text-xs">Status</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-semibold">{service.uptime}</div>
                      <div className="text-gray-500 text-xs">30-Day Uptime</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-semibold">{service.responseTime}</div>
                      <div className="text-gray-500 text-xs">Avg Response</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 text-right">
                    <span className="text-gray-500 text-xs">Last updated: {service.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Regional Status */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Regional <span className="text-gradient-yellow">Status</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.map((region, index) => (
                <div key={index} className="enterprise-card text-center">
                  <div className="text-3xl mb-3">{getStatusIcon(region.status)}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{region.name}</h3>
                  <div className={`font-medium capitalize mb-4 ${getStatusColor(region.status)}`}>
                    {region.status}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Latency:</span>
                      <span className="text-white">{region.latency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Load:</span>
                      <span className="text-white">{region.load}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance Metrics */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Performance <span className="text-gradient-yellow">Metrics</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="enterprise-card text-center">
                  <h3 className="text-lg font-semibold text-white mb-3">{metric.name}</h3>
                  <div className="text-3xl font-bold text-saint-yellow-400 mb-2">{metric.value}</div>
                  <div className={`text-sm mb-2 ${metric.change.startsWith('+') ? 'text-green-400' : metric.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
                    {metric.change} {metric.period}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Incidents */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Recent <span className="text-gradient-yellow">Incidents</span>
            </h2>
            
            <div className="space-y-6">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="glass rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{incident.title}</h3>
                      <p className="text-gray-400 text-sm">{incident.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        incident.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                        incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-white/20 pl-4 space-y-3">
                    {incident.updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-saint-yellow-400 rounded-full mt-2"></div>
                        <div>
                          <div className="text-gray-400 text-xs mb-1">
                            {update.time.toLocaleString()}
                          </div>
                          <div className="text-white text-sm">{update.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-500">
                    Started: {incident.startTime.toLocaleString()}
                    {incident.resolvedTime && (
                      <span> • Resolved: {incident.resolvedTime.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Subscribe to Updates */}
          <section className="text-center">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                📱 Stay Informed
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Subscribe to real-time status updates and incident notifications. Get notified immediately 
                when issues are detected or resolved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="btn-primary">
                  📧 Email Notifications
                </button>
                <button className="btn-secondary">
                  📱 SMS Alerts
                </button>
                <button className="btn-outline">
                  🔔 Webhook Integration
                </button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Updates delivered via email, SMS, Slack, or custom webhooks</p>
                <p>Configure notifications in your enterprise dashboard</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}