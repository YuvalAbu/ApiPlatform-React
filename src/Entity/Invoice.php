<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *      subresourceOperations={
 *          "api_customers_invoices_get_subresource" = {
 *              "normalization_context"={
 *                   "groups"={"invoices_subresource"}
 *              }
 *          }
 *      },
 *      itemOperations={"GET", "PUT", "DELETE", 
 *          "increment"={
 *              "method"="post", 
 *              "path"="/invoices/{id}/increment",
 *              "controller"="App\Controller\InvoiceIncrementationController",
 *              "swagger_context"={
 *                  "summary"="Increment invoice.",
 *                  "description"="Increment the chrono of invoice."
 *              }
 *          }
 *      },
 *      attributes={
 *      "pagination_enabled" = false,
 *      "pagination_items_per_page" = 20,
 *      "order": {"sentAt":"desc"}
 *      },
 *      normalizationContext={
 *          "groups"={"invoices_read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      },
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 * 
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Invoice amount is required")
     * @Assert\Type(type="numeric", message="Amount must be numeric")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\DateTime(message="The format of date must be YYY-MM-DD")
     * @Assert\NotBlank(message="SentAt is required")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Statuts is required")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Status must be SENT, PAID, CANCELLED ")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Customer is required")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Chrono is required")
     * @Assert\Type(type="integer", message="Chrono must be an integer")
     */
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Récupère l'user qui a fait la facture
     * @Groups({"invoices_read", "invoices_subresource"})     
     * @return User
     */
    public function getUser() : User
    {
        return $this->customer->getUser();
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
