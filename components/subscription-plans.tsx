"use client"

import { useState } from "react"
import { Check, Crown, Zap, Building2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SubscriptionPlansProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan?: "free" | "starter" | "business" | "enterprise"
  onPlanSelect: (plan: string) => void
}

export default function SubscriptionPlans({
  open,
  onOpenChange,
  currentPlan = "free",
  onPlanSelect,
}: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: <Zap className="h-5 w-5" />,
      price: { monthly: 20, yearly: 200 },
      description: "Perfect for individual business travelers",
      popular: false,
      features: [
        "AI-powered flight & hotel search",
        "Basic expense tracking",
        "Document OCR processing (10/month)",
        "Email support",
        "Mobile app access",
        "Basic travel insights",
        "Standard booking fees",
      ],
      limits: "Up to 10 trips per month",
    },
    {
      id: "business",
      name: "Business",
      icon: <Crown className="h-5 w-5" />,
      price: { monthly: 49, yearly: 490 },
      description: "Ideal for frequent business travelers",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced AI travel optimization",
        "Unlimited document processing",
        "Calendar integration",
        "Priority support (24/7)",
        "Advanced analytics & reporting",
        "Corporate rate access",
        "Travel policy compliance",
        "Expense approval workflows",
        "Multi-currency support",
        "Carbon footprint tracking",
      ],
      limits: "Unlimited trips",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: <Building2 className="h-5 w-5" />,
      price: { monthly: 200, yearly: 2000 },
      description: "Complete solution for organizations",
      popular: false,
      features: [
        "Everything in Business",
        "White-label solution",
        "Custom AI training",
        "API access & integrations",
        "Dedicated account manager",
        "Custom reporting dashboards",
        "SSO & advanced security",
        "Bulk user management",
        "Custom approval workflows",
        "Advanced compliance tools",
        "Predictive analytics",
        "Custom integrations",
        "SLA guarantees",
      ],
      limits: "Unlimited everything + custom features",
    },
  ]

  const handlePlanSelect = (planId: string) => {
    onPlanSelect(planId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-white/10 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-white font-light">Upgrade to Suitpax AI Pro</DialogTitle>
              <p className="text-white/60 mt-1 text-sm font-light">
                Unlock the full potential of AI-powered business travel management
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <span className={cn("text-sm font-light", billingCycle === "monthly" ? "text-white" : "text-white/50")}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              billingCycle === "yearly" ? "bg-white" : "bg-white/20",
            )}
          >
            <span
              className={cn(
                "inline-block h-3 w-3 transform rounded-full bg-black transition-transform",
                billingCycle === "yearly" ? "translate-x-5" : "translate-x-1",
              )}
            />
          </button>
          <span className={cn("text-sm font-light", billingCycle === "yearly" ? "text-white" : "text-white/50")}>
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs font-light">Save 17%</Badge>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative bg-black border transition-all hover:border-white/30",
                plan.popular ? "border-white/30 ring-1 ring-white/20" : "border-white/10",
                currentPlan === plan.id && "ring-2 ring-blue-500",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white text-black font-light text-xs">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="p-1.5 bg-white/10 rounded-lg">{plan.icon}</div>
                </div>
                <CardTitle className="text-white text-lg font-light">{plan.name}</CardTitle>
                <p className="text-white/50 text-xs font-light">{plan.description}</p>

                <div className="mt-3">
                  <div className="flex items-baseline justify-center">
                    <span className="text-2xl font-light text-white">€{plan.price[billingCycle]}</span>
                    <span className="text-white/50 ml-1 text-sm font-light">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-green-400 text-xs mt-1 font-light">
                      €{((plan.price.monthly * 12 - plan.price.yearly) / 12).toFixed(0)} saved per month
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-white/60 text-xs font-light">{plan.limits}</p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70 text-xs font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={cn(
                    "w-full mt-4 font-light",
                    plan.popular
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20",
                    currentPlan === plan.id && "bg-blue-600 hover:bg-blue-700",
                  )}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-white font-light text-lg mb-3 text-center">Why upgrade to Suitpax AI Pro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: "🤖",
                title: "Advanced AI",
                description: "Predictive travel optimization and smart recommendations",
              },
              {
                icon: "📄",
                title: "Document OCR",
                description: "Automatic processing of receipts, invoices, and travel documents",
              },
              {
                icon: "📊",
                title: "Analytics",
                description: "Detailed insights and reporting for travel optimization",
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                description: "Advanced security features and compliance tools",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-xl mb-1">{feature.icon}</div>
                <h4 className="text-white font-light text-xs mb-1">{feature.title}</h4>
                <p className="text-white/50 text-xs font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
