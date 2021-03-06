// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;

//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import "@aave/protocol-v2/contracts/interfaces/IAToken.sol";
import {WadRayMath} from "@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol";
import {PercentageMath} from "@aave/protocol-v2/contracts/protocol/libraries/math/PercentageMath.sol";
import {SafeMath} from "@aave/protocol-v2/contracts/protocol/libraries/math/MathUtils.sol";
import "hardhat/console.sol";

/**
 * @title for Proxy
 * @dev not implemented yet
 */
 /*
contract BaseContract is Initializable {
    uint256 public x;
    function initialize(uint256 _x) public initializer {
        x = _x;
    }
    
}
*/


/**
 * @title ClimateWarriors
 * @dev fight against the climate change with the climate warriors
 */
contract YourContract is Ownable {
    
    // Events

    event Deposit(uint256 _amount);
    event Withdraw(uint256 _amount, uint256 _earned);
    event Funding(uint256 _donated, address _from);

    address public _owner;
    using SafeMath for uint256;
    using WadRayMath for uint256;
    using PercentageMath for uint256;
    

    //IAToken DAI = IAToken(0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD);
    //IAToken aDAI = IAToken(0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8);
    //IAToken USDT = IAToken(0x13512979ADE267AB5100878E2e0f485B568328a4);
    //IAToken aUSDT = IAToken(0xFF3c8bc103682FA918c954E84F5056aB4DD5189d);
    //IAToken WBTC = IAToken(0xD1B98B6607330172f1D991521145A22BCe793277);
    //IAToken aWBTC = IAToken(0x62538022242513971478fcC7Fb27ae304AB5C29F);
    
    constructor () {
        USDC.approve(address(lendingPool), type(uint).max);
        _owner = msg.sender; 
    }
    

    // Kovan //
    address usdcAddress = 0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e; // Mumbai
    IAToken USDC = IAToken(usdcAddress);
    IAToken aUSDC = IAToken(0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9); // Mumbai
    //IAToken MCO2 = IAToken(0xfC98e825A2264D890F9a1e68ed50E1526abCcacD);
    //
    ILendingPoolAddressesProvider provider = ILendingPoolAddressesProvider(address(0x178113104fEcbcD7fF8669a0150721e231F0FD4B)); // kovan
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
    //

    uint256 totalaUSDCdonated;

    struct Character {
        uint256 deposited;
        uint256 totalBalance;
        uint256 earned;
        uint256 donated;
        uint256 reserveIndex;
    }
    
    mapping (address => Character) public account;

    function deposit(uint256 _amount) 
    public{
        USDC.transferFrom(msg.sender, address(this), _amount);
        Character storage user = account[msg.sender];
        user.totalBalance += _amount;
        lendingPool.deposit(address(usdcAddress), _amount, address(this), 0);
        user.reserveIndex = lendingPool.getReserveNormalizedIncome(usdcAddress);
        user.deposited += _amount.rayDiv(lendingPool.getReserveNormalizedIncome(usdcAddress));
        emit Deposit(_amount);  
    }

    function withdrawalCalculator(uint256 _balance, uint256 _interestRate, uint256 _generosity) public view returns (uint256, uint256, uint256, uint256, uint256) {
        uint256 depositBalance = _balance.rayMul(account[msg.sender].reserveIndex);
        uint256 newBalance = _balance.rayMul(_interestRate);
        uint256 onlyInterest = newBalance - depositBalance;
        uint256 donated = onlyInterest.percentMul(_generosity.mul(100));
        uint256 earned = onlyInterest - donated;
        uint256 withdrawalAmount = newBalance - donated;
        return (newBalance, onlyInterest,  donated, earned, withdrawalAmount);
    }

    function withdraw(uint256 generosity) public {
        require(account[msg.sender].deposited != 0, "You don't have any funds here!");
        require(generosity >= 10, "At least 10% of the interest will be donated!");

        Character storage user = account[msg.sender];
        
        uint256 totalBalance;
        uint256 onlyInterest;
        uint256 donated;
        uint256 earned;
        uint256 withdrawalAmount;

        (totalBalance, onlyInterest,  donated, earned, withdrawalAmount) = withdrawalCalculator(user.deposited, lendingPool.getReserveNormalizedIncome(usdcAddress), generosity);
        
        lendingPool.withdraw(address(usdcAddress), totalBalance, address(this));

        totalaUSDCdonated += donated;

        user.deposited = 0;
        user.totalBalance = 0;
        USDC.transfer(msg.sender, withdrawalAmount);
        emit Withdraw(withdrawalAmount, earned);
        emit Funding(donated, msg.sender);
    }

    function withdrawToBuyCarbonCredits() onlyOwner public {
        lendingPool.withdraw(address(usdcAddress), account[address(this)].totalBalance, _owner); // 
    }

    //function checkCarbonCredits() public view returns(uint256){
      //  return MCO2.balanceOf(address(this));
    //}

    function setOwner(address newOwner) onlyOwner external {
        _owner = newOwner;
    }

    function checkAccount() public view returns ( uint256, uint256, uint256, uint256) {
        return (account[msg.sender].deposited, 
                account[msg.sender].totalBalance,
                account[msg.sender].earned,
                account[msg.sender].donated);
     }
  
}
